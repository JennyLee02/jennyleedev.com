import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.dSAPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: "DSA post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch DSA post:", error)
    return NextResponse.json(
      { error: "Failed to fetch DSA post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { title, slug, description, content, category, difficulty, tags, readTime } = await request.json()

    const post = await prisma.dSAPost.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        category,
        difficulty,
        tags,
        readTime: parseInt(readTime) || 5,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to update DSA post:", error)
    return NextResponse.json(
      { error: "Failed to update DSA post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.dSAPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete DSA post:", error)
    return NextResponse.json(
      { error: "Failed to delete DSA post" },
      { status: 500 }
    )
  }
} 