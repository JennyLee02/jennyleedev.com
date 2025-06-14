import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const posts = await prisma.dSAPost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Failed to fetch DSA posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch DSA posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, description, content, category, tags, readTime, practiceQuestions } = await request.json()
    
    const post = await prisma.dSAPost.create({
      data: {
        title,
        slug,
        description,
        content,
        category,
        tags,
        readTime: parseInt(readTime) || 5,
        practiceQuestions: practiceQuestions || null,
      },
    })
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to create DSA post:", error)
    return NextResponse.json(
      { error: "Failed to create DSA post" },
      { status: 500 }
    )
  }
} 