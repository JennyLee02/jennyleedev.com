"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, X, Plus, Minus, Upload, Trash2 } from "lucide-react"
import Image from "next/image"

interface ListItem {
  text: string
  image?: string
}

export default function CreateRetrospectivePage() {
  const router = useRouter()
  const currentDate = new Date()
  
  const [formData, setFormData] = useState({
    month: (currentDate.getMonth() + 1).toString(),
    year: currentDate.getFullYear().toString(),
    thumbnail: "",
    achievements: [{ text: "", image: "" }] as ListItem[],
    challenges: [{ text: "", image: "" }] as ListItem[],
    learnings: [""],
    improvements: [""],
    goals: [""],
    highlights: "",
    reflection: "",
    tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({})
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  // Generate title from month and year
  const generateTitle = (month: string, year: string) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const monthIndex = parseInt(month) - 1
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`
    }
    return "Monthly Report"
  }

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('files', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Upload error:', response.status, errorData)
      throw new Error(errorData.error || `Upload failed with status ${response.status}`)
    }
    
    const responseData = await response.json()
    if (!responseData.files || responseData.files.length === 0) {
      throw new Error('No files returned from upload')
    }
    
    return responseData.files[0].url
  }

  // Generate formatted content from form data
  const generateContent = () => {
    const { achievements, challenges, learnings, improvements, goals, highlights, reflection } = formData
    
    let content = ""
    
    if (highlights.trim()) {
      content += `## Month Overview\n\n${highlights.trim()}\n\n`
    }
    
    // Achievements
    if (achievements.some(item => item.text.trim() || item.image)) {
      content += `## 🎉 What Went Well\n\n`
      achievements.filter(item => item.text.trim() || item.image).forEach(achievement => {
        if (achievement.text.trim()) {
          content += `- ${achievement.text.trim()}\n`
        }
        if (achievement.image) {
          content += `  ![Achievement](${achievement.image})\n`
        }
        content += `\n`
      })
    }
    
    // Challenges
    if (challenges.some(item => item.text.trim() || item.image)) {
      content += `## 🚧 Challenges Faced\n\n`
      challenges.filter(item => item.text.trim() || item.image).forEach(challenge => {
        if (challenge.text.trim()) {
          content += `- ${challenge.text.trim()}\n`
        }
        if (challenge.image) {
          content += `  ![Challenge](${challenge.image})\n`
        }
        content += `\n`
      })
    }
    
    // Learnings
    if (learnings.some(item => item.trim())) {
      content += `## 💡 Key Learnings\n\n`
      learnings.filter(item => item.trim()).forEach(learning => {
        content += `- ${learning.trim()}\n`
      })
      content += `\n`
    }
    
    // Improvements
    if (improvements.some(item => item.trim())) {
      content += `## 🔧 Areas for Improvement\n\n`
      improvements.filter(item => item.trim()).forEach(improvement => {
        content += `- ${improvement.trim()}\n`
      })
      content += `\n`
    }
    
    // Goals
    if (goals.some(item => item.trim())) {
      content += `## 🎯 Goals for Next Month\n\n`
      goals.filter(item => item.trim()).forEach(goal => {
        content += `- ${goal.trim()}\n`
      })
      content += `\n`
    }
    
    if (reflection.trim()) {
      content += `## 🤔 Final Reflection\n\n${reflection.trim()}\n\n`
    }
    
    return content.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const title = generateTitle(formData.month, formData.year)
      const content = generateContent()
      
      const response = await fetch("/api/retrospective", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          thumbnail: formData.thumbnail,
          tags: formData.tags
        }),
      })

      if (response.ok) {
        router.push("/admin/retrospective")
      } else {
        console.error("Failed to create retrospective post")
      }
    } catch (error) {
      console.error("Error creating retrospective post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addListItem = (field: keyof typeof formData) => {
    if (field === 'achievements' || field === 'challenges') {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as ListItem[]), { text: "", image: "" }]
      })
    } else if (Array.isArray(formData[field])) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] as string[]), ""]
      })
    }
  }

  const removeListItem = (field: keyof typeof formData, index: number) => {
    if (field === 'achievements' || field === 'challenges') {
      const items = [...(formData[field] as ListItem[])]
      items.splice(index, 1)
      if (items.length === 0) items.push({ text: "", image: "" })
      setFormData({
        ...formData,
        [field]: items
      })
    } else if (Array.isArray(formData[field])) {
      const items = [...(formData[field] as string[])]
      items.splice(index, 1)
      if (items.length === 0) items.push("")
      setFormData({
        ...formData,
        [field]: items
      })
    }
  }

  const updateListItem = (field: keyof typeof formData, index: number, value: string) => {
    if (field === 'achievements' || field === 'challenges') {
      const items = [...(formData[field] as ListItem[])]
      items[index] = { ...items[index], text: value }
      setFormData({
        ...formData,
        [field]: items
      })
    } else if (Array.isArray(formData[field])) {
      const items = [...(formData[field] as string[])]
      items[index] = value
      setFormData({
        ...formData,
        [field]: items
      })
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumbnail(true)
    
    try {
      // Client-side validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.')
      }
      
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 2MB.')
      }
      
      const imageUrl = await uploadImage(file)
      setFormData({
        ...formData,
        thumbnail: imageUrl
      })
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload thumbnail'
      alert(`Upload failed: ${errorMessage}`)
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const removeThumbnail = () => {
    setFormData({
      ...formData,
      thumbnail: ""
    })
  }

  const handleImageUpload = async (field: 'achievements' | 'challenges', index: number, file: File) => {
    const uploadKey = `${field}-${index}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))
    
    try {
      // Client-side validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.')
      }
      
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 2MB.')
      }
      
      const imageUrl = await uploadImage(file)
      const items = [...(formData[field] as ListItem[])]
      items[index] = { ...items[index], image: imageUrl }
      setFormData({
        ...formData,
        [field]: items
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
      alert(`Upload failed: ${errorMessage}`)
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const removeImage = (field: 'achievements' | 'challenges', index: number) => {
    const items = [...(formData[field] as ListItem[])]
    items[index] = { ...items[index], image: "" }
    setFormData({
      ...formData,
      [field]: items
    })
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        })
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const renderImageListSection = (
    title: string,
    field: 'achievements' | 'challenges',
    placeholder: string,
    icon: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(formData[field] as ListItem[]).map((item, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <div className="flex gap-2">
              <Textarea
                value={item.text}
                onChange={(e) => updateListItem(field, index, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
                rows={4}
              />
              {(formData[field] as ListItem[]).length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeListItem(field, index)}
                  className="self-start"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {item.image ? (
              <div className="relative">
                <Image
                  src={item.image}
                  alt="Uploaded image"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(field, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Label className="text-sm text-muted-foreground">Add photo (optional)</Label>
                <div className="mt-1">
                  <Label
                    htmlFor={`image-${field}-${index}`}
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  >
                    {uploadingImages[`${field}-${index}`] ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <span className="text-sm text-muted-foreground mt-2">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
                        <span className="text-sm text-muted-foreground mt-2">Click to upload image</span>
                      </div>
                    )}
                  </Label>
                  <Input
                    id={`image-${field}-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(field, index, file)
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addListItem(field)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  )

  const renderListSection = (
    title: string,
    field: keyof typeof formData,
    placeholder: string,
    icon: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(formData[field] as string[]).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={item}
              onChange={(e) => updateListItem(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              rows={4}
            />
            {(formData[field] as string[]).length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeListItem(field, index)}
                className="self-start"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addListItem(field)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  )

  // Generate years for the dropdown (current year - 2 to current year + 1)
  const years = Array.from({ length: 4 }, (_, i) => (currentDate.getFullYear() - 2 + i).toString())
  
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin/retrospective" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Retrospective Posts
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create Retrospective Post</h1>
          <p className="text-muted-foreground">
            Create a new monthly retrospective post using the structured form below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select
                      value={formData.month}
                      onValueChange={(value) => setFormData({ ...formData, month: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Title preview:</p>
                  <p className="font-medium">{generateTitle(formData.month, formData.year)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="space-y-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type a tag and press Enter"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🖼️ Thumbnail Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Upload a thumbnail image (this will also serve as the hero image)</Label>
                  {formData.thumbnail ? (
                    <div className="relative mt-2">
                      <Image
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        width={400}
                        height={200}
                        className="rounded-lg object-cover border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeThumbnail}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Label
                        htmlFor="thumbnail"
                        className="flex items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
                      >
                        {uploadingThumbnail ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <span className="text-sm text-muted-foreground mt-2">Uploading...</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                            <span className="text-sm text-muted-foreground mt-2">Click to upload thumbnail image</span>
                            <span className="text-xs text-muted-foreground block mt-1">Recommended: 16:9 aspect ratio</span>
                          </div>
                        )}
                      </Label>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleThumbnailUpload(file)
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📝 Month Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="highlights">Brief overview of the month</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Summarize the key events, themes, or overall experience of this month..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {renderImageListSection(
            "What Went Well",
            "achievements",
            "Describe an achievement or positive outcome",
            "🎉"
          )}

          {renderImageListSection(
            "Challenges Faced",
            "challenges",
            "Describe a challenge or difficulty you encountered",
            "🚧"
          )}

          {renderListSection(
            "Key Learnings",
            "learnings",
            "What did you learn or discover?",
            "💡"
          )}

          {renderListSection(
            "Areas for Improvement",
            "improvements",
            "What could be improved or done differently?",
            "🔧"
          )}

          {renderListSection(
            "Goals for Next Month",
            "goals",
            "What do you want to achieve or focus on?",
            "🎯"
          )}

          <Card>
            <CardHeader>
              <CardTitle>🤔 Final Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="reflection">Overall thoughts and reflections</Label>
                <Textarea
                  id="reflection"
                  value={formData.reflection}
                  onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                  placeholder="Share any final thoughts, insights, or reflections on the month..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
            <Link href="/admin/retrospective">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 