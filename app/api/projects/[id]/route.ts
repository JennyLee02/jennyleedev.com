import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// GET - Fetch a single project by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Try to find by ID first, then by slug
    let project
    
    // Check if the id is a valid MongoDB ObjectId (24 characters) or UUID
    if (id.length === 24 || id.includes('-')) {
      project = await prisma.project.findUnique({
        where: { id }
      })
    }
    
    // If not found by ID, try by slug
    if (!project) {
      project = await prisma.project.findUnique({
        where: { slug: id }
      })
    }
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PUT - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    console.log('Updating project with ID:', id)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { title, description, content, technologies = [], imageUrls = [], thumbnailUrl, githubUrl, liveUrl, featured = false } = body

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if project exists first
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    console.log('Found existing project:', existingProject.title)

    // Generate unique slug (excluding current project)
    let baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check for existing slugs and make it unique (excluding current project)
    while (true) {
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      })
      
      if (!existingProject || existingProject.id === id) {
        break
      }
      
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Ensure slug is not empty
    if (!slug) {
      slug = `project-${Date.now()}`
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        technologies,
        imageUrls,
        thumbnailUrl: thumbnailUrl || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// DELETE - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
} 