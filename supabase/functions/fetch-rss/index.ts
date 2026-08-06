import { createClient } from 'jsr:@supabase/supabase-js@2'
import { XMLParser } from 'https://esm.sh/fast-xml-parser@4.2.4'

// Timeout de 10s par flux
const FETCH_TIMEOUT_MS = 10000
// 1 an
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

const defaultMapping = {
  title: 'title',
  link: 'link',
  published: 'pubDate'
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseTagValue: true,
  parseAttributeValue: true
})

function getByPath(obj: any, path?: string) {
  if (!path) return null
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Permet d'extraire de manière robuste le lien (gère les chaines, les objets Atom avec @_href, etc.)
function extractLink(linkVal: any): string | null {
  if (!linkVal) return null
  if (typeof linkVal === 'string') return linkVal
  if (typeof linkVal === 'object') {
    if (Array.isArray(linkVal)) {
      const alternate = linkVal.find((l) => l['@_rel'] === 'alternate') || linkVal[0]
      return alternate?.['@_href'] || alternate?.toString() || null
    }
    return linkVal['@_href'] || linkVal['#text'] || null
  }
  return linkVal.toString()
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: sources, error } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Sources error', error)
    return new Response('Error fetching sources', { status: 500 })
  }

  const limitDate = new Date(Date.now() - MAX_AGE_MS)

  // Traitement en parallèle de toutes les sources
  await Promise.allSettled(
    sources.map(async (source) => {
      try {
        console.log(`Fetching ${source.url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

        const res = await fetch(source.url, { signal: controller.signal })
        clearTimeout(timeoutId)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const text = await res.text()
        const json = parser.parse(text)

        let items: any[] = []
        if (json.rss?.channel?.item) {
          items = Array.isArray(json.rss.channel.item)
            ? json.rss.channel.item
            : [json.rss.channel.item]
        } else if (json.feed?.entry) {
          items = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry]
        }

        const mapping = {
          ...defaultMapping,
          ...source.field_mapping
        }

        const articlesToUpsert: any[] = []

        for (const item of items) {
          const rawTitle = getByPath(item, mapping.title)
          const rawLink = getByPath(item, mapping.link)
          const published = getByPath(item, mapping.published)

          const title = rawTitle?.toString()
          const link = extractLink(rawLink)

          if (!title || !link) continue

          const pubDate = published ? new Date(published) : null
          if (pubDate && pubDate < limitDate) continue

          articlesToUpsert.push({
            title,
            link,
            published_at: pubDate,
            source_id: source.id
          })
        }

        // Un seul batch upsert par flux (Résout le problème N+1 requêtes)
        if (articlesToUpsert.length > 0) {
          const { error: insertError } = await supabase
            .from('articles')
            .upsert(articlesToUpsert, { onConflict: 'link' })

          if (insertError) {
            throw new Error(`Insert error: ${insertError.message}`)
          }
        }

        await supabase
          .from('rss_sources')
          .update({
            last_fetched_at: new Date().toISOString(),
            last_error: null // Permet d'effacer une ancienne erreur
          })
          .eq('id', source.id)
      } catch (err) {
        console.error(`RSS error for ${source.url}:`, err.message)
        // Optionnel : Enregistre l'erreur en base pour le feedback utilisateur
        await supabase
          .from('rss_sources')
          .update({ last_error: err.message })
          .eq('id', source.id)
          .maybeSingle()
      }
    })
  )

  return new Response('RSS fetch completed', { status: 200 })
})
