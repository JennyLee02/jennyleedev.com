"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface RetrospectivePost {
  id: string
  title: string
  content: string
  tags: string[]
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export default function RetrospectivePage() {
  const [posts, setPosts] = useState<RetrospectivePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/retrospective")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch retrospective posts:", error)
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

  const getExcerpt = (content: string) => {
    // Remove markdown syntax and get first 80 characters to match project card height
    const plainText = content.replace(/[#*_`[\]()]/g, '').replace(/\n/g, ' ')
    return plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Monthly Retrospectives</h1>
          <p className="text-muted-foreground">
            A monthly reflection on my progress, challenges, learnings, and goals. These retrospectives help me track my
            growth as a developer.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No retrospectives yet</h3>
            <p className="text-muted-foreground">
              Check back soon for monthly reflections and insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/retrospective/${post.id}`}
                className="group"
              >
                <Card className="overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                  {post.thumbnail && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={post.thumbnail} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {getExcerpt(post.content)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      Click to view retrospective details →
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

