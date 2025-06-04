"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { PracticeQuestionsEditor, PracticeQuestion } from "@/components/practice-questions-editor"

interface DSAPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  tags: string[]
  readTime: number
  practiceQuestions?: PracticeQuestion[] | null
}

export default function EditDSAPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    readTime: "5"
  })

  const categories = [
    "Dynamic Programming",
    "Graph Algorithms", 
    "Greedy Algorithms",
    "Sorting Algorithms",
    "Divide and Conquer",
    "Tree Algorithms",
    "Hash Tables",
    "Searching Algorithms",
    "Array Techniques",
    "String Algorithms",
    "Linked List Operations",
    "Stack & Queue",
    "Recursion & Backtracking",
    "Two Pointers",
    "Sliding Window",
    "Binary Search",
    "Heap & Priority Queue",
    "Trie",
    "Union Find"
  ]

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getId()
  }, [params])

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/dsa/${id}`)
      if (response.ok) {
        const post: DSAPost = await response.json()
        setFormData({
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content,
          category: post.category,
          tags: post.tags.join(', '),
          readTime: post.readTime.toString()
        })
        setPracticeQuestions(post.practiceQuestions || [])
      }
    } catch (error) {
      console.error("Failed to fetch DSA post:", error)
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const response = await fetch(`/api/dsa/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          practiceQuestions,
        }),
      })

      if (response.ok) {
        router.push("/admin/dsa")
      } else {
        console.error("Failed to update DSA post")
      }
    } catch (error) {
      console.error("Error updating DSA post:", error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/dsa" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to DSA Posts
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit DSA Post</h1>
          <p className="text-muted-foreground">
            Update the educational post about algorithms and data structures concepts.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-2 block">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Understanding Big-O Notation"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="mb-2 block">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="Auto-generated from title"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the algorithm or data structure concept..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="mb-2 block">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="readTime" className="mb-2 block">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange('readTime', e.target.value)}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags" className="mb-2 block">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="algorithm, theory, optimization, complexity"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your educational content about the algorithm or data structure..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <PracticeQuestionsEditor
                questions={practiceQuestions}
                onChange={setPracticeQuestions}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dsa")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 