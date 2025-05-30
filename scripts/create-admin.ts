import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Update these values with your preferred credentials
  const email = 'j234lee@uwaterloo.ca' // Change to your preferred email
  const password = 'Jjunny199486' // Keep your preferred password
  const name = 'Jenny Lee'

  console.log('🔒 Creating fresh hash for password:', password)
  const hashedPassword = await bcrypt.hash(password, 12)
  console.log('🔒 New hash created:', hashedPassword.substring(0, 20) + '...')

  // Test the hash immediately
  const testResult = await bcrypt.compare(password, hashedPassword)
  console.log('✅ Hash validation test:', testResult)

  try {
    // Force update the existing user with new hash
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword, // Force update the password hash
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('✅ Admin user updated:', {
      email: user.email,
      name: user.name,
      role: user.role,
      passwordUpdated: 'Yes'
    })
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 