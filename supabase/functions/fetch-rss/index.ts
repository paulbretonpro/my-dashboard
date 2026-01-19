import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { XMLParser } from 'https://esm.sh/fast-xml-parser@4.2.4'

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  })

  const { data: sources, error } = await supabase
    .from('rss_sources')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Sources error', error)
    return new Response('Error fetching sources', { status: 500 })
  }

  console.log(`Found ${sources.length} RSS sources`)

  for (const source of sources) {
    try {
      console.log(`Fetching ${source.url}`)
      const res = await fetch(source.url)
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

      console.log(`Found ${items.length} items for ${source.name}`)

      for (const item of items) {
        const title = item.title ?? item['title']?.['#text']
        const link = item.link?.['@_href'] ?? item.link ?? item.id ?? null
        const published = item.pubDate ?? item.published ?? item.updated ?? null
        const summary = item.description ?? item.summary ?? item.content ?? null

        const publishedAtIsBeforeOneYearAgo = published
          ? new Date(published) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          : false

        if (!title || !link || publishedAtIsBeforeOneYearAgo) continue

        const { error: insertError } = await supabase
          .from('articles')
          .upsert(
            {
              title: title.toString(),
              link: link.toString(),
              summary: summary?.toString() ?? null,
              published_at: published ? new Date(published) : null,
              source_id: source.id,
            },
            { onConflict: 'title' } // title doit être unique
          )

        if (insertError) {
          console.error('Insert error', insertError)
        }
      }

      await supabase
        .from('rss_sources')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', source.id)

    } catch (err) {
      console.error(`RSS error for ${source.url}`, err)
    }
  }

  return new Response('RSS fetch completed', { status: 200 })
})
