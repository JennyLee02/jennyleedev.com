"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Check } from "lucide-react"

interface ThumbnailPickerProps {
  images: string[]
  selectedThumbnail?: string
  onThumbnailChange: (thumbnailUrl: string | null) => void
  label?: string
  className?: string
}

export function ThumbnailPicker({
  images,
  selectedThumbnail,
  onThumbnailChange,
  label = "Project Thumbnail",
  className = ""
}: ThumbnailPickerProps) {
  const [selected, setSelected] = useState<string | null>(selectedThumbnail || null)

  // Update selected when prop changes
  useEffect(() => {
    setSelected(selectedThumbnail || null)
  }, [selectedThumbnail])

  const handleSelect = (imageUrl: string) => {
    const newSelection = selected === imageUrl ? null : imageUrl
    setSelected(newSelection)
    onThumbnailChange(newSelection)
  }

  if (images.length === 0) {
    return (
      <div className={className}>
        <Label className="text-base font-medium">{label}</Label>
        <Card className="mt-2">
          <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">No images uploaded yet</p>
            <p className="text-xs">Upload images in the content editor to select a thumbnail</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <Label className="text-base font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground mt-1 mb-3">
        Select an image to use as the project thumbnail. This will appear in project listings.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <Card key={index} className="relative group cursor-pointer overflow-hidden">
            <div 
              className={`relative aspect-video border-2 transition-all ${
                selected === imageUrl 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelect(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Project image ${index + 1}`}
                fill
                className="object-cover rounded-sm"
              />
              
              {/* Selection overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                selected === imageUrl 
                  ? 'bg-primary/20 opacity-100' 
                  : 'bg-black/0 opacity-0 group-hover:bg-black/10 group-hover:opacity-100'
              }`}>
                {selected === imageUrl && (
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {/* Image number */}
              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {selected && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Selected thumbnail:</strong> Image {images.findIndex(img => img === selected) + 1}
          </p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => handleSelect(selected)}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  )
} 