# TipTap Rich Text Editor Setup Guide

A comprehensive guide to implementing TipTap rich text editor in Next.js applications with all the features you need for content creation.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Package Dependencies](#package-dependencies)
4. [Component Implementation](#component-implementation)
5. [File Structure](#file-structure)
6. [Usage Examples](#usage-examples)
7. [Styling & Customization](#styling--customization)
8. [Advanced Features](#advanced-features)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

TipTap is a modern, headless rich text editor built on top of ProseMirror. This guide shows you how to implement a complete rich text editor with:

- **Text Formatting**: Bold, italic, underline, strikethrough, code
- **Headings**: H1, H2, H3 support
- **Lists**: Bullet lists and ordered lists
- **Media**: Images and links
- **Code Blocks**: Syntax highlighting with lowlight
- **Text Alignment**: Left, center, right, justify
- **Blocks**: Blockquotes and code blocks
- **Actions**: Undo/redo functionality

> **⚠️ Important**: This implementation requires **shadcn/ui** components (Button and Input) for the toolbar and dialogs. Make sure you have shadcn/ui set up in your project before using this component.

## Prerequisites

### shadcn/ui Setup

This TipTap implementation requires shadcn/ui components. If you don't have shadcn/ui set up in your project:

1. **Initialize shadcn/ui** (if not already done):
   ```bash
   npx shadcn@latest init
   ```

2. **Install required components**:
   ```bash
   # For pnpm
   pnpm dlx shadcn@latest add button input
   
   # For npm
   npx shadcn@latest add button input
   ```

## Installation

### 1. Install Required Packages

```bash
# Install TipTap packages
pnpm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-code-block-lowlight @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder lowlight

# Install required shadcn/ui components (if not already installed)
pnpm dlx shadcn@latest add button input
```

### 2. Package Versions

```json
{
  "@tiptap/react": "^3.4.5",
  "@tiptap/starter-kit": "^3.4.5",
  "@tiptap/extension-image": "^3.4.5",
  "@tiptap/extension-link": "^3.4.5",
  "@tiptap/extension-code-block-lowlight": "^3.4.5",
  "@tiptap/extension-text-align": "^3.4.5",
  "@tiptap/extension-underline": "^3.4.5",
  "@tiptap/extension-placeholder": "^3.4.5",
  "lowlight": "^3.3.0"
}
```

## Package Dependencies

### Core Packages
- **@tiptap/react**: React integration for TipTap
- **@tiptap/starter-kit**: Basic functionality (bold, italic, headings, lists, etc.)

### Extensions
- **@tiptap/extension-image**: Image support with URL insertion
- **@tiptap/extension-link**: Link creation and editing
- **@tiptap/extension-code-block-lowlight**: Code blocks with syntax highlighting
- **@tiptap/extension-text-align**: Text alignment (left, center, right, justify)
- **@tiptap/extension-underline**: Underline text formatting
- **@tiptap/extension-placeholder**: Placeholder text when editor is empty

### Syntax Highlighting
- **lowlight**: Lightweight syntax highlighter for code blocks

### UI Components (Required)
- **shadcn/ui Button**: For toolbar buttons
- **shadcn/ui Input**: For image and link dialogs

## Component Implementation

### Basic Component Structure

```typescript
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

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
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

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar and Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

## File Structure

```
components/
└── ui/
    └── rich-text-editor.tsx    # Main TipTap component
```

### Recommended File Organization

```
components/
├── ui/
│   ├── rich-text-editor.tsx    # Main editor component
│   ├── button.tsx              # UI button component (if not exists)
│   └── input.tsx               # UI input component (if not exists)
└── forms/
    └── blog-form.tsx           # Example form using the editor
```

## Usage Examples

### 1. Basic Usage

```typescript
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useState } from 'react'

export function BlogForm() {
  const [content, setContent] = useState('')

  return (
    <div>
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Write your blog post content here..."
      />
    </div>
  )
}
```

### 2. Form Integration

```typescript
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useState } from 'react'

export function CreatePostForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form>
      <input
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Post title"
      />
      
      <RichTextEditor
        content={formData.content}
        onChange={(content) => handleInputChange('content', content)}
        placeholder="Write your content here..."
      />
      
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### 3. Controlled Component

```typescript
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useEffect, useState } from 'react'

export function EditPostForm({ postId }: { postId: string }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch post content
    fetchPost(postId).then(post => {
      setContent(post.content)
      setLoading(false)
    })
  }, [postId])

  if (loading) return <div>Loading...</div>

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="Edit your post content..."
    />
  )
}
```

## Styling & Customization

### 1. CSS Variables Integration

The component uses CSS variables for consistent theming:

```css
:root {
  --font-roboto: 'Roboto', sans-serif;
  --primary-purple: #8082C1;
  --muted-foreground: #6b7280;
  --border-gray-700: #374151;
  --muted: #f3f4f6;
}
```

### 2. Custom Styling

```typescript
// In your component
<style jsx global>{`
  .ProseMirror {
    font-family: var(--font-roboto) !important;
  }
  .ProseMirror h1 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    margin: 1rem 0 !important;
  }
  .ProseMirror img {
    max-width: 100% !important;
    height: auto !important;
    border-radius: 0.5rem !important;
  }
`}</style>
```

### 3. Dark Mode Support

```css
.dark .ProseMirror {
  color: var(--foreground);
  background-color: var(--background);
}

.dark .ProseMirror blockquote {
  border-left-color: var(--primary-purple);
  color: var(--muted-foreground);
}
```

## Advanced Features

### 1. Image Upload Integration

```typescript
const addImage = (imageUrl: string) => {
  if (editor && imageUrl) {
    editor.chain().focus().setImage({ src: imageUrl }).run()
  }
}

// Usage with file upload
const handleImageUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const { url } = await response.json()
  addImage(url)
}
```

### 2. Link Management

```typescript
const addLink = (url: string) => {
  if (editor && url) {
    editor.chain().focus().setLink({ href: url }).run()
  }
}

const removeLink = () => {
  if (editor) {
    editor.chain().focus().unsetLink().run()
  }
}
```

### 3. Custom Extensions

```typescript
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',
  
  addCommands() {
    return {
      insertCustomContent: () => ({ commands }) => {
        return commands.insertContent('<p>Custom content inserted!</p>')
      },
    }
  },
})

// Add to extensions array
extensions: [
  StarterKit,
  CustomExtension,
  // ... other extensions
]
```

## Troubleshooting

### Common Issues

1. **Editor not rendering**
   - Check if all required packages are installed
   - Verify the component is wrapped in a client component
   - Ensure the editor container has proper dimensions

2. **Styling issues**
   - Make sure CSS variables are defined
   - Check if Tailwind classes are properly configured
   - Verify the prose classes are available

3. **Image upload not working**
   - Check if the image URL is valid
   - Ensure CORS is properly configured
   - Verify the image extension is supported

4. **Code blocks not highlighting**
   - Make sure lowlight is properly installed
   - Check if the language is supported
   - Verify the CodeBlockLowlight extension is configured

5. **Button or Input components not found**
   - Ensure shadcn/ui is properly initialized in your project
   - Run `npx shadcn@latest init` if you haven't already
   - Install the required components: `npx shadcn@latest add button input`
   - Check that the components are in `components/ui/` directory
   - Verify your import paths are correct (`@/components/ui/button`)

6. **shadcn/ui styling issues**
   - Make sure you have the required CSS variables in your globals.css
   - Check that Tailwind CSS is properly configured
   - Verify the shadcn/ui configuration in your `components.json`

### Debug Mode

```typescript
const editor = useEditor({
  // ... other config
  onUpdate: ({ editor }) => {
    console.log('Editor content:', editor.getHTML())
    console.log('Editor JSON:', editor.getJSON())
  },
})
```

## Best Practices

### 1. Performance Optimization

```typescript
// Use React.memo for the component
export const RichTextEditor = React.memo(({ content, onChange, placeholder }) => {
  // Component implementation
})

// Debounce onChange if needed
import { useDebouncedCallback } from 'use-debounce'

const debouncedOnChange = useDebouncedCallback((content: string) => {
  onChange(content)
}, 300)
```

### 2. Error Handling

```typescript
const editor = useEditor({
  // ... other config
  onError: ({ editor, view, state, oldState, transaction, dispatch }) => {
    console.error('Editor error:', { editor, view, state, oldState, transaction, dispatch })
  },
})
```

### 3. Accessibility

```typescript
const editor = useEditor({
  // ... other config
  editorProps: {
    attributes: {
      'aria-label': 'Rich text editor',
      'role': 'textbox',
      'aria-multiline': 'true',
    },
  },
})
```

### 4. Content Validation

```typescript
const validateContent = (html: string) => {
  // Basic HTML validation
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Check for script tags or other dangerous content
  const scripts = doc.querySelectorAll('script')
  if (scripts.length > 0) {
    throw new Error('Script tags are not allowed')
  }
  
  return true
}

const handleContentChange = (content: string) => {
  try {
    validateContent(content)
    onChange(content)
  } catch (error) {
    console.error('Invalid content:', error)
  }
}
```

## Conclusion

This guide provides everything you need to implement a complete TipTap rich text editor in your Next.js application. The implementation includes:

- Complete feature set for content creation
- Proper styling with your design system
- Form integration examples
- Advanced features and customization
- Troubleshooting and best practices
- **shadcn/ui integration** for UI components

### Quick Setup

For the fastest setup, use the aypackage system:
```bash
npx aypackage systems tiptap
```

This will automatically:
- Install all TipTap dependencies
- Create the complete component
- Install required shadcn/ui components (Button and Input)
- Set up the file structure
- Provide usage examples

### Manual Setup

If you prefer manual setup, make sure to:
1. Install TipTap packages
2. Set up shadcn/ui in your project
3. Install Button and Input components
4. Copy the component code
5. Configure your styling
