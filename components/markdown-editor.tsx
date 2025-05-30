"use client"

import { useState, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, Image as ImageIcon, Eye, Edit, Code, ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  label, 
  placeholder = "Start writing your project description in Markdown...", 
  required = false,
  className = ""
}: MarkdownEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Popular programming languages for code blocks
  const codeLanguages = [
    { label: "Plain Text", value: "" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
    { label: "PHP", value: "php" },
    { label: "Ruby", value: "ruby" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "SQL", value: "sql" },
    { label: "Bash", value: "bash" },
    { label: "JSON", value: "json" },
    { label: "YAML", value: "yaml" },
    { label: "Markdown", value: "markdown" },
  ]

  const insertCodeBlock = useCallback((language: string) => {
    const codeBlockTemplate = language 
      ? `\`\`\`${language}\n// Your ${language} code here\n\`\`\``
      : `\`\`\`\n// Your code here\n\`\`\``
    
    const newValue = value ? `${value}\n\n${codeBlockTemplate}` : codeBlockTemplate
    onChange(newValue)
    toast.success(`${language ? language.charAt(0).toUpperCase() + language.slice(1) : "Code"} block inserted!`)
  }, [value, onChange])

  const handleImageUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 2 * 1024 * 1024 // 2MB (reduced from 5MB)

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`)
        return
      }

      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 2MB.`)
        return
      }
    }

    // Additional validation: Check image dimensions
    for (const file of files) {
      try {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            
            // Check if image is too large (max 4000x4000 pixels)
            if (img.width > 4000 || img.height > 4000) {
              reject(new Error(`Image ${file.name} is too large. Maximum dimensions are 4000x4000 pixels.`))
              return
            }
            
            // Check if image is too small (min 100x100 pixels)
            if (img.width < 100 || img.height < 100) {
              reject(new Error(`Image ${file.name} is too small. Minimum dimensions are 100x100 pixels.`))
              return
            }
            
            resolve(true)
          }
          
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error(`Failed to load image ${file.name}`))
          }
          
          img.src = objectUrl
        })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Invalid image: ${file.name}`)
        return
      }
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        // Insert markdown image syntax for each uploaded image
        const imageMarkdown = result.urls.map((url: string, index: number) => {
          const filename = files[index]?.name || `image-${index + 1}`
          const altText = filename.replace(/\.[^/.]+$/, "") // Remove extension for alt text
          return `![${altText}](${url})`
        }).join('\n\n')

        // Insert at the end of current content
        const newValue = value ? `${value}\n\n${imageMarkdown}` : imageMarkdown
        onChange(newValue)
        
        toast.success(`${files.length} image(s) uploaded and inserted!`)
      } else {
        toast.error(result.error || "Failed to upload images")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("An error occurred while uploading the images")
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [value, onChange])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleImageUpload(files)
    }
  }, [handleImageUpload])

  const markdownComponents = {
    // Enhance components as needed
    img: ({ src, alt }: any) => (
      <img 
        src={src} 
        alt={alt} 
        className="w-full max-w-4xl mx-auto my-4 aspect-video object-cover rounded border block" 
      />
    ),
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    p: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      return inline ? (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
          {children}
        </code>
      ) : (
        <div className="my-4">
          {language && (
            <div className="bg-muted rounded-t-lg px-3 py-1 text-xs text-muted-foreground font-mono">
              {language}
            </div>
          )}
          <SyntaxHighlighter
            style={oneDark}
            language={language || 'text'}
            PreTag="div"
            className={`${language ? 'rounded-b-lg' : 'rounded-lg'}`}
            customStyle={{
              margin: 0,
              borderRadius: language ? '0 0 0.5rem 0.5rem' : '0.5rem',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      )
    },
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-base font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border rounded-t-lg bg-muted/50">
        <Button
          type="button"
          variant={previewMode ? "outline" : "default"}
          size="sm"
          onClick={() => setPreviewMode(false)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          type="button"
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode(true)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <div className="h-4 w-px bg-border" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          {isUploading ? "Uploading..." : "Add Images"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={previewMode}
            >
              <Code className="h-4 w-4 mr-1" />
              Code Block
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
            {codeLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => insertCodeBlock(lang.value)}
                className="cursor-pointer"
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editor/Preview Container */}
      <div className="border rounded-b-lg min-h-[400px]">
        {previewMode ? (
          <div className="p-4 prose prose-sm max-w-none">
            {value ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <div className="text-muted-foreground italic">
                Nothing to preview yet. Switch to Edit mode to start writing.
              </div>
            )}
          </div>
        ) : (
          <div className="h-[400px]">
            <MDEditor
              value={value}
              onChange={(val) => onChange(val || "")}
              preview="edit"
              hideToolbar
              visibleDragbar={false}
              data-color-mode="light"
              height={400}
              style={{
                backgroundColor: 'transparent',
              }}
              textareaProps={{
                placeholder,
                style: {
                  fontSize: '14px',
                  lineHeight: '1.5',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  color: '#ffffff',
                  backgroundColor: 'hsl(var(--background))',
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Helper text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Write in Markdown for rich formatting</p>
        <p>• Use "Add Images" to upload and insert images anywhere in your content</p>
        <p>• Use "Code Block" to insert syntax-highlighted code with language selection</p>
        <p>• Images: Max 2MB, dimensions 100x100 to 4000x4000 pixels, JPEG/PNG/WebP/GIF only</p>
        <p>• Images will be automatically formatted with markdown syntax: ![alt text](image-url)</p>
        <p>• Use the Preview tab to see how your content will look</p>
        <p>• Code blocks: Use ```language for syntax highlighting (e.g., ```javascript, ```python)</p>
      </div>
    </div>
  )
}