import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const posts = await prisma.retrospectivePost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Failed to fetch retrospective posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch retrospective posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, tags, thumbnail } = await request.json()
    
    const post = await prisma.retrospectivePost.create({
      data: {
        title,
        content,
        tags,
        ...(thumbnail && { thumbnail }),
      },
    })
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to create retrospective post:", error)
    return NextResponse.json(
      { error: "Failed to create retrospective post" },
      { status: 500 }
    )
  }
} 