"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight } from 'lowlight'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  Code2
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: '',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(),
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
        style: 'font-family: var(--font-roboto);'
      },
    },
    immediatelyRender: false,
  })

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageDialog(false)
    }
  }

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkDialog(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg" style={{ borderColor: 'var(--border-gray-700)' }}>
      <style jsx global>{`
        .ProseMirror {
          font-family: var(--font-roboto) !important;
        }
        .ProseMirror h1 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          margin: 1rem 0 !important;
          line-height: 1.2 !important;
        }
        .ProseMirror h2 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.875rem 0 !important;
          line-height: 1.3 !important;
        }
        .ProseMirror h3 {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 !important;
          line-height: 1.4 !important;
        }
        .ProseMirror p {
          margin: 0.5rem 0 !important;
          line-height: 1.6 !important;
        }
        .ProseMirror br {
          margin: 0.5rem 0 !important;
        }
        .ProseMirror hr {
          margin: 1rem 0 !important;
          border: none !important;
          border-top: 1px solid var(--border-gray-700) !important;
        }
        .ProseMirror img {
          display: block !important;
          margin: 1rem auto !important;
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          margin: 0.5rem 0 !important;
          padding-left: 1.5rem !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          margin: 0.5rem 0 !important;
          padding-left: 1.5rem !important;
        }
        .ProseMirror li {
          margin: 0.25rem 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
          list-style-position: outside !important;
        }
        .ProseMirror li p {
          display: inline !important;
          margin: 0 !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--primary-purple) !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: var(--muted-foreground) !important;
        }
        .ProseMirror code {
          background-color: var(--muted) !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.875rem !important;
        }
        .ProseMirror pre {
          background-color: var(--muted) !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
          overflow-x: auto !important;
        }
        .ProseMirror a {
          color: var(--primary-purple) !important;
          text-decoration: underline !important;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b" style={{ borderColor: 'var(--border-gray-700)' }}>
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('bold') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('italic') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('underline') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('strike') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('code') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-muted mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground hover:bg-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-muted mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('bulletList') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('orderedList') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('blockquote') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <Code2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-muted mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`hover:bg-muted/50 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
            }`}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-muted mx-1" />

        {/* Media */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(true)}
            className="hover:bg-muted/50 transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
            className="hover:bg-muted/50 transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-muted mx-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-96" style={{ borderColor: 'var(--border-gray-700)' }}>
            <h3 className="text-lg font-semibold mb-4">Add Image</h3>
            <Input
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={addImage} disabled={!imageUrl}>
                Add Image
              </Button>
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-96" style={{ borderColor: 'var(--border-gray-700)' }}>
            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
            <Input
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={addLink} disabled={!linkUrl}>
                Add Link
              </Button>
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
