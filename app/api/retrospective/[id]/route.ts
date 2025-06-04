import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.retrospectivePost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: "Retrospective post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch retrospective post:", error)
    return NextResponse.json(
      { error: "Failed to fetch retrospective post" },
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
    const { title, content, tags, thumbnail } = await request.json()

    const post = await prisma.retrospectivePost.update({
      where: { id },
      data: {
        title,
        content,
        tags,
        ...(thumbnail !== undefined && { thumbnail }),
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to update retrospective post:", error)
    return NextResponse.json(
      { error: "Failed to update retrospective post" },
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
    await prisma.retrospectivePost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete retrospective post:", error)
    return NextResponse.json(
      { error: "Failed to delete retrospective post" },
      { status: 500 }
    )
  }
} 