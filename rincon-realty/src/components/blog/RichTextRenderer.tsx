import { cn } from '@/lib/utils/cn'

interface RichTextRendererProps {
  content: string
  className?: string
}

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str)

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null

  // Plain text (legacy descriptions saved before Tiptap editor was added)
  if (!isHtml(content)) {
    return (
      <p
        className={cn('text-neutral-600 leading-relaxed whitespace-pre-wrap', className)}
      >
        {content}
      </p>
    )
  }

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
