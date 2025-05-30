import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const files = data.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 2 * 1024 * 1024 // 2MB (reduced from 5MB)

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 2MB.` },
          { status: 400 }
        )
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Process and save each file
    const uploadedFiles = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      const extension = path.extname(file.name)
      const filename = `${timestamp}-${randomSuffix}${extension}`
      
      const filepath = path.join(uploadsDir, filename)
      
      // Write the file
      await writeFile(filepath, buffer)
      
      // Add to results
      uploadedFiles.push({
        url: `/uploads/${filename}`,
        filename: filename,
        originalName: file.name
      })
    }
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      urls: uploadedFiles.map(f => f.url)
    })

  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    )
  }
} 