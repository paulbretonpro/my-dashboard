<script setup lang="ts">
import type { EditorToolbarItem, EditorEmojiMenuItem, DropdownMenuItem } from '@nuxt/ui'
import type { Editor, EditorEvents, JSONContent } from '@tiptap/vue-3'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TextAlign } from '@tiptap/extension-text-align'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { ImageUpload } from '@/composables/editor/editor-image-upload-completion'

const content = defineModel<string>({ required: true })

const emit = defineEmits<{
  onBlur: [editor: EditorEvents['blur'] & { title: string }]
}>()

const editorRef = useTemplateRef('editorRef')

const placeholder = 'Entre ton texte, tape "/ " pour les commandes...'

const {
  completionExtension,
  suggestionItems,
  bubbleToolbarItems,
  fixedToolbarItems,
  customHandlers
} = useEditor(editorRef)

const imageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
  const node = editor.state.doc.nodeAt(editor.state.selection.from)

  return [
    [
      {
        icon: 'i-lucide-download',
        to: node?.attrs?.src,
        download: true,
        tooltip: { text: 'Download' }
      },
      {
        icon: 'i-lucide-refresh-cw',
        tooltip: { text: 'Replace' },
        onClick: () => {
          const { state } = editor
          const { selection } = state

          const pos = selection.from
          const node = state.doc.nodeAt(pos)

          if (node && node.type.name === 'image') {
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .insertContentAt(pos, { type: 'imageUpload' })
              .run()
          }
        }
      }
    ],
    [
      {
        icon: 'i-lucide-trash',
        tooltip: { text: 'Delete' },
        onClick: () => {
          const { state } = editor
          const { selection } = state

          const pos = selection.from
          const node = state.doc.nodeAt(pos)

          if (node && node.type.name === 'image') {
            editor
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .run()
          }
        }
      }
    ]
  ]
}

const selectedNode = ref<{ node: JSONContent; pos: number }>()

const handleItems = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value?.node?.type) {
    return []
  }

  return mapEditorItems(
    editor,
    [
      [
        {
          type: 'label',
          label: upperFirst(selectedNode.value.node.type)
        },
        {
          label: 'Turn into',
          icon: 'i-lucide-repeat-2',
          children: [
            { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
            { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
            { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
            { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
            { kind: 'heading', level: 4, label: 'Heading 4', icon: 'i-lucide-heading-4' },
            { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
            { kind: 'orderedList', label: 'Ordered List', icon: 'i-lucide-list-ordered' },
            { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
            { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' }
          ]
        },
        {
          kind: 'clearFormatting',
          pos: selectedNode.value?.pos,
          label: 'Reset formatting',
          icon: 'i-lucide-rotate-ccw'
        }
      ],
      [
        {
          kind: 'duplicate',
          pos: selectedNode.value?.pos,
          label: 'Duplicate',
          icon: 'i-lucide-copy'
        },
        {
          label: 'Copy to clipboard',
          icon: 'i-lucide-clipboard',
          onSelect: async () => {
            if (!selectedNode.value) return

            const pos = selectedNode.value.pos
            const node = editor.state.doc.nodeAt(pos)
            if (node) {
              await navigator.clipboard.writeText(node.textContent)
            }
          }
        }
      ],
      [
        {
          kind: 'moveUp',
          pos: selectedNode.value?.pos,
          label: 'Move up',
          icon: 'i-lucide-arrow-up'
        },
        {
          kind: 'moveDown',
          pos: selectedNode.value?.pos,
          label: 'Move down',
          icon: 'i-lucide-arrow-down'
        }
      ],
      [
        {
          kind: 'delete',
          pos: selectedNode.value?.pos,
          label: 'Delete',
          icon: 'i-lucide-trash'
        }
      ]
    ],
    customHandlers
  ) as DropdownMenuItem[][]
}

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(
  (emoji) => !emoji.name.startsWith('regional_indicator_')
)

const handleUploadContent = async (props: EditorEvents['blur']) => {
  const title = getTitleFromJSON(editorRef.value?.editor?.getJSON() || { content: [] })

  emit('onBlur', { ...props, title })
}

const getTitleFromJSON = (json: JSONContent): string => {
  const firstNode = json.content?.[0]
  if (firstNode?.type === 'heading' && firstNode.content?.[0]?.type === 'text') {
    const title = firstNode.content[0].text || 'Untitled'
    return title
  }
  return 'Untitled'
}
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor, handlers }"
    v-model="content"
    @blur="handleUploadContent"
    :extensions="[
      Emoji,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ImageUpload,
      CodeBlockShiki.configure({
        defaultTheme: 'material-theme',
        themes: {
          light: 'material-theme-lighter',
          dark: 'material-theme-palenight'
        }
      }),
      completionExtension
    ]"
    :handlers="customHandlers"
    :placeholder="{
      placeholder,
      includeChildren: true,
      showOnlyCurrent: false
    }"
    class="w-full"
    :ui="{
      content: 'py-4 h-fit'
    }"
  >
    <UEditorToolbar
      :editor="editor"
      :items="fixedToolbarItems"
      class="border border-muted rounded-lg sticky top-0 inset-x-0 px-4 py-2 z-50 bg-default overflow-x-auto"
    >
      <template #link>
        <SharedEditorLinkPopover :editor="editor" auto-open />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="
        ({ editor, view, state }) => {
          if (editor.isActive('imageUpload') || editor.isActive('image')) {
            return false
          }
          const { selection } = state
          return view.hasFocus() && !selection.empty
        }
      "
    >
      <template #link>
        <SharedEditorLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="imageToolbarItems(editor)"
      layout="bubble"
      :should-show="
        ({ editor, view }) => {
          return editor.isActive('image') && view.hasFocus()
        }
      "
    />
    <UEditorDragHandle
      v-slot="{ ui, onClick }"
      :editor="editor"
      @node-change="selectedNode = $event"
    >
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="
          (e) => {
            e.stopPropagation()

            const selected = onClick()
            handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
          }
        "
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="handleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          icon="i-lucide-grip-vertical"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
    <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
  </UEditor>
</template>

<style>
html.dark .tiptap .shiki,
html.dark .tiptap .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--ui-bg-muted) !important;
}
</style>
