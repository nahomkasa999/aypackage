# TipTap Rich Text Editor System

A complete TipTap rich text editor implementation with all the features you need for content creation.

## Features

- **Text Formatting**: Bold, italic, underline, strikethrough, code
- **Headings**: H1, H2, H3 support
- **Lists**: Bullet lists and ordered lists
- **Media**: Images and links
- **Code Blocks**: Syntax highlighting with lowlight
- **Text Alignment**: Left, center, right, justify
- **Blocks**: Blockquotes and code blocks
- **Actions**: Undo/redo functionality

## Installation

```bash
npx aypackage systems tiptap
```

## Usage

```typescript
import { RichTextEditor } from '@/components/ui/rich-text-editor'

export function MyForm() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="Write your content here..."
    />
  )
}
```

## Dependencies

The system will automatically add these packages to your package.json:

- @tiptap/react
- @tiptap/starter-kit
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-code-block-lowlight
- @tiptap/extension-text-align
- @tiptap/extension-underline
- @tiptap/extension-placeholder
- lowlight

## File Structure

```
components/ui/rich-text-editor.tsx
```

## Customization

The component uses your existing design system colors and can be customized through CSS variables.
