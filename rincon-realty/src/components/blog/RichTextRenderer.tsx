import { cn } from '@/lib/utils/cn'

interface RichTextRendererProps {
  content: string // HTML string from Tiptap
  className?: string
}

/**
 * Renders Tiptap HTML content safely with Tailwind typography styles.
 * Content is sanitized server-side before storage; this component
 * only renders trusted content from the admin dashboard.
 */
export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        'prose prose-neutral max-w-none',
        'prose-headings:font-heading prose-headings:text-ink',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-xl',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
