"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  technologies: string[]
  imageUrls: string[]
  thumbnailUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

function ImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative h-[60vh] overflow-hidden bg-muted">
        <Image 
          src="/placeholder.svg?height=600&width=1200"
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="relative h-[60vh] overflow-hidden">
        <Image 
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative h-[60vh] overflow-hidden group">
      <Image 
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-all duration-300"
      />
      
      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
      
      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Project not found')
          } else {
            throw new Error('Failed to fetch project')
          }
        } else {
          const data = await response.json()
          setProject(data)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Failed to load project')
      } finally {
      setLoading(false)
      }
    }

    if (slug) {
      fetchProject()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Header section skeleton */}
          <div className="relative h-[60vh] bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="container mx-auto px-4">
                <div className="h-8 bg-muted-foreground/20 rounded mb-4 max-w-md" />
                <div className="h-12 bg-muted-foreground/20 rounded mb-4 max-w-lg" />
                <div className="flex gap-2 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-muted-foreground/20 rounded" />
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-24 bg-muted-foreground/20 rounded" />
                  <div className="h-10 w-24 bg-muted-foreground/20 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="h-6 bg-muted rounded mb-4 max-w-xs" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/projects">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
              </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return null
  }

  const formattedDate = new Date(project.createdAt).getFullYear().toString()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative">
          <ImageGallery images={project.imageUrls} title={project.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="mr-2 h-4 w-4" />
                {formattedDate}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                </Button>
                  </Link>
                )}
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                </Button>
                  </Link>
                )}
              </div>
            </div>
              </div>
            </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/projects" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
            </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Overview Section */}
            <div className="prose prose-lg max-w-none dark:prose-invert mx-auto">
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <p className="text-muted-foreground mb-6">{project.description}</p>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  img: ({ src, alt }) => (
                    <Image
                      src={typeof src === 'string' ? src : ''}
                      alt={alt || ''}
                      width={800}
                      height={450}
                      className="rounded-lg shadow-sm object-contain border w-full max-w-4xl mx-auto my-4 aspect-video"
                    />
                  ),
                }}
              >
                {project.content}
              </ReactMarkdown>
            </div>

            {/* Technologies Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-sm">
                        {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Gallery Section */}
            {project.imageUrls.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {project.imageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg border shadow-sm">
                      <Image
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300 bg-muted"
                      />
                    </div>
                ))}
              </div>
            </div>
            )}

            {/* Links Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Links</h2>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <Link 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      View Source Code
                    </Button>
                  </Link>
                )}
                {project.liveUrl && (
                  <Link 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

