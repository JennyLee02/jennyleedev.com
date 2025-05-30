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

// GET - Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, technologies = [], imageUrls = [], thumbnailUrl, githubUrl, liveUrl, featured = false } = body

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate unique slug
    let baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check for existing slugs and make it unique
    while (true) {
      const existingProject = await prisma.project.findUnique({
        where: { slug }
      })
      
      if (!existingProject) {
        break
      }
      
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Ensure slug is not empty
    if (!slug) {
      slug = `project-${Date.now()}`
    }

    console.log('Creating project with data:', {
      title,
      slug,
      description,
      content,
      technologies,
      imageUrls,
      thumbnailUrl,
      githubUrl,
      liveUrl,
      featured,
    })

    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 