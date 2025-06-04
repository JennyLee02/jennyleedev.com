const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

async function updateRetrospectiveTitles() {
  try {
    console.log('🔍 Fetching all retrospective posts...')
    
    const posts = await prisma.retrospectivePost.findMany()
    console.log(`📊 Found ${posts.length} retrospective posts`)
    
    let updatedCount = 0
    
    for (const post of posts) {
      // Check if title ends with "Retrospective"
      if (post.title.endsWith(' Retrospective')) {
        const newTitle = post.title.replace(' Retrospective', '')
        
        await prisma.retrospectivePost.update({
          where: { id: post.id },
          data: { title: newTitle }
        })
        
        console.log(`✅ Updated: "${post.title}" → "${newTitle}"`)
        updatedCount++
      } else {
        console.log(`⏭️  Skipped: "${post.title}" (doesn't end with ' Retrospective')`)
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} retrospective titles!`)
    
  } catch (error) {
    console.error('❌ Error updating titles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateRetrospectiveTitles() 