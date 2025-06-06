import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// Dynamic import for Vercel Blob (only in production)
const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL
let vercelBlobPut: any

console.log('Upload route initialization:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  isProduction,
  hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
})

if (isProduction) {
  try {
    const vercelBlob = require('@vercel/blob')
    vercelBlobPut = vercelBlob.put
    console.log('Vercel Blob loaded successfully')
  } catch (error) {
    console.error('Failed to load Vercel Blob:', error)
    console.warn('Vercel Blob not available, falling back to local storage')
  }
}

export async function POST(request: NextRequest) {
  console.log('Upload request started')
  
  try {
    // Check authentication
    console.log('Checking authentication...')
    const session = await getServerSession(authOptions)
    console.log('Session:', { 
      hasSession: !!session, 
      userRole: session?.user?.role,
      userEmail: session?.user?.email 
    })
    
    if (!session || session.user.role !== "admin") {
      console.log('Authentication failed')
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log('Getting form data...')
    const data = await request.formData()
    const files = data.getAll('files') as File[]
    console.log('Files received:', files.length)

    if (!files || files.length === 0) {
      console.log('No files in request')
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 4 * 1024 * 1024 // 4MB

    console.log('Validating files...')
    for (const file of files) {
      console.log('Validating file:', { 
        name: file.name, 
        type: file.type, 
        size: file.size 
      })
      
      if (!allowedTypes.includes(file.type)) {
        console.log('Invalid file type:', file.type)
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        console.log('File too large:', file.size)
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 4MB.` },
          { status: 400 }
        )
      }
    }

    const uploadedFiles = []
    console.log('Starting upload process...', {
      isProduction,
      hasVercelBlobPut: !!vercelBlobPut,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
    })

    // Production: Use Vercel Blob if available
    if (isProduction && vercelBlobPut && process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('Using Vercel Blob storage')
      
      for (const file of files) {
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${timestamp}-${randomSuffix}.${extension}`
        
        console.log('Uploading to Vercel Blob:', filename)
        
        try {
          const blob = await vercelBlobPut(filename, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          })
          
          console.log('Vercel Blob upload successful:', blob.url)
          
          uploadedFiles.push({
            url: blob.url,
            filename: filename,
            originalName: file.name
          })
        } catch (error) {
          console.error('Vercel Blob upload failed:', error)
          console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            filename,
            fileSize: file.size,
            fileType: file.type
          })
          return NextResponse.json(
            { error: `Failed to upload ${file.name} to cloud storage: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
          )
        }
      }
    } 
    // Development: Use local file system
    else {
      console.log('Using local file system storage')
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      console.log('Uploads directory:', uploadsDir)
      
      try {
        await mkdir(uploadsDir, { recursive: true })
        console.log('Uploads directory created/verified')
      } catch (error) {
        console.log('Directory creation error (might already exist):', error)
      }

      for (const file of files) {
        console.log('Processing file for local storage:', file.name)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        const extension = path.extname(file.name)
        const filename = `${timestamp}-${randomSuffix}${extension}`
        
        const filepath = path.join(uploadsDir, filename)
        console.log('Writing file to:', filepath)
        
        // Write the file
        await writeFile(filepath, buffer)
        console.log('File written successfully')
        
        uploadedFiles.push({
          url: `/uploads/${filename}`,
          filename: filename,
          originalName: file.name
        })
      }
    }
    
    console.log('Upload completed successfully:', {
      filesCount: uploadedFiles.length,
      storage: isProduction && vercelBlobPut ? 'vercel-blob' : 'local'
    })
    
    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      urls: uploadedFiles.map(f => f.url),
      storage: isProduction && vercelBlobPut ? 'vercel-blob' : 'local'
    })

  } catch (error) {
    console.error("Error uploading files:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json(
      { error: `Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 