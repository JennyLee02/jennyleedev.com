"use client"

import { useState, useEffect, use } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"

interface RetrospectivePost {
  id: string
  title: string
  content: string
  tags: string[]
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export default function RetrospectivePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: postId } = use(params)
  const [post, setPost] = useState<RetrospectivePost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/retrospective/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        setError(true)
      }
    } catch (error) {
      console.error("Failed to fetch retrospective post:", error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // Enhanced markdown components for better rendering
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 pb-2 border-b">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mb-4 mt-8 first:mt-0 flex items-center gap-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mb-3 mt-6">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="leading-7 mb-4 text-muted-foreground">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside mb-6 space-y-2 ml-6 pl-2">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-outside mb-6 space-y-2 ml-6 pl-2">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-7 pl-1">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted/50 italic">
        {children}
      </blockquote>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        )
      }
      return <code className={className}>{children}</code>
    },
    pre: ({ children }: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        {children}
      </pre>
    ),
    a: ({ href, children }: any) => (
      <a 
        href={href} 
        className="text-primary hover:text-primary/80 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }: any) => (
      <figure className="my-6">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={600}
          height={400}
          className="rounded-lg shadow-sm object-cover border w-full max-w-2xl mx-auto"
        />
      </figure>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-muted">{children}</thead>
    ),
    tbody: ({ children }: any) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="border-b">{children}</tr>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-left">{children}</td>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 text-left font-semibold">{children}</th>
    ),
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The retrospective post you're looking for doesn't exist.
          </p>
          <Link href="/retrospective" className="text-primary hover:underline">
            ← Back to Retrospectives
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/retrospective" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Retrospectives
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {calculateReadTime(post.content)} min read
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {post.thumbnail && (
            <div className="mb-8">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={800}
                height={400}
                className="w-full rounded-lg object-cover shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}

