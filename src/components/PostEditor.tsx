import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, Code, Quote, Type
} from 'lucide-react'
import { usePostStore } from '../store'
import { useCallback, useEffect } from 'react'
import { Card, SectionHeader } from './ui'

export default function PostEditor() {
  const setHtmlContent = usePostStore((s) => s.setHtmlContent)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, bulletList: false, orderedList: false, listItem: false, horizontalRule: false, dropcursor: false, gapcursor: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap',
        'data-placeholder': 'Напишіть щось цікаве...',
      },
    },
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML())
    },
  })

  useEffect(() => {
    const unsub = usePostStore.subscribe((state, prev) => {
      if (state.htmlContent === '' && prev.htmlContent !== '' && editor) {
        editor.commands.clearContent()
      }
    })
    return unsub
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL посилання:', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const mediaFiles = usePostStore((s) => s.mediaFiles)
  const maxChars = mediaFiles.length > 0 ? 1024 : 4096
  const textLength = editor?.getText().length || 0
  const charsLeft = maxChars - textLength

  if (!editor) return null

  const actions = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { icon: LinkIcon, action: setLink, active: editor.isActive('link') },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
  ]

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <SectionHeader title="Текст посту" icon={Type} color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" />
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${charsLeft < 0 ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'}`}>
          {textLength} <span className="opacity-50">/ {maxChars}</span>
        </span>
      </div>

      <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-black/20 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-200">
        <div className="flex flex-wrap gap-1 p-2 bg-white/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
          {actions.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={item.action}
              className={`p-2 rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} strokeWidth={item.active ? 2.5 : 2} />
            </button>
          ))}
        </div>
        
        <div className="p-4 min-h-[140px] max-h-[400px] overflow-y-auto custom-scrollbar">
          <EditorContent editor={editor} />
        </div>
      </div>
    </Card>
  )
}
