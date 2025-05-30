import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await prisma.dSAPost.findFirst({
      where: { slug },
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