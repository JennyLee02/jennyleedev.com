"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect, useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { MarkdownEditor } from "@/components/markdown-editor"
import { ThumbnailPicker } from "@/components/thumbnail-picker"
import { useMarkdownImages } from "@/hooks/use-markdown-images"

export default function EditProjectPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
  })
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    thumbnailUrl: "" as string | null,
  })

  // Extract images from markdown content
  const markdownImages = useMarkdownImages(formData.content)

  // Fetch existing project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (response.ok) {
          const project = await response.json()
          setFormData({
            title: project.title,
            description: project.description,
            content: project.content,
            githubUrl: project.githubUrl || "",
            liveUrl: project.liveUrl || "",
            featured: project.featured,
            thumbnailUrl: project.thumbnailUrl || null,
          })
          setTechnologies(project.technologies || [])
        } else {
          toast.error("Failed to fetch project data")
          router.push("/admin/projects")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast.error("An error occurred while fetching project data")
        router.push("/admin/projects")
      } finally {
        setIsFetching(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, router])

  if (status === "loading" || isFetching) {
    return <div>Loading...</div>
  }

  if (session?.user?.role !== "admin") {
    redirect("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      featured: checked
    }))
  }

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies(prev => [...prev, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTechnology = (techToRemove: string) => {
    setTechnologies(prev => prev.filter(tech => tech !== techToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechnology()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const projectData = {
      ...formData,
      technologies,
      imageUrls: markdownImages,
      thumbnailUrl: formData.thumbnailUrl,
    }

    console.log('Updating project data:', projectData)

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      const responseData = await response.json()
      console.log('Response status:', response.status)
      console.log('Response data:', responseData)

      if (response.ok) {
        toast.success("Project updated successfully!")
        router.push("/admin/projects")
      } else {
        console.error('Error response:', responseData)
        const errorMessage = responseData.error || 'Unknown error'
        toast.error(`Failed to update project: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("An error occurred while updating the project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update the information below to modify this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., E-commerce Platform"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief description of your project (2-3 sentences)"
                rows={3}
                required
              />
            </div>

            {/* Markdown Content Editor */}
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              label="Project Content"
              placeholder="Write your project description in Markdown. You can include headings, lists, code blocks, and upload images inline..."
              required
            />

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies & Tools</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add technology (e.g., React, Node.js)"
                />
                <Button type="button" onClick={addTechnology} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="pr-1">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeTechnology(tech)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Demo URL</Label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="featured">Feature this project (show prominently on homepage)</Label>
            </div>

            {/* Thumbnail Picker */}
            <ThumbnailPicker
              images={markdownImages}
              selectedThumbnail={formData.thumbnailUrl || undefined}
              onThumbnailChange={(thumbnailUrl: string | null) => setFormData(prev => ({ ...prev, thumbnailUrl }))}
            />

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Project"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/projects">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 