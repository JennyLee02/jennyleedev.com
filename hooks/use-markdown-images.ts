import { useMemo } from "react"

export function useMarkdownImages(markdownContent: string): string[] {
  return useMemo(() => {
    if (!markdownContent) return []
    
    // Regular expression to match markdown image syntax: ![alt](url)
    const imageRegex = /!\[.*?\]\((.*?)\)/g
    const images: string[] = []
    let match
    
    while ((match = imageRegex.exec(markdownContent)) !== null) {
      const imageUrl = match[1]
      if (imageUrl && !images.includes(imageUrl)) {
        images.push(imageUrl)
      }
    }
    
    return images
  }, [markdownContent])
} 