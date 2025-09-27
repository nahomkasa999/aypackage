#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

console.log('🚀 Installing Better Auth system...')

// Get the current working directory
const projectRoot = process.cwd()
const sourceDir = path.join(__dirname, 'next.js')

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Helper function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

// Ask which package manager to use
const askPackageManager = async () => {
  console.log('')
  console.log('📦 Which package manager are you using?')
  console.log('1. npm')
  console.log('2. pnpm') 
  console.log('3. yarn')
  
  const choice = await askQuestion('Enter your choice (1-3): ')
  
  switch (choice.trim()) {
    case '1':
    case 'npm':
      return 'npm'
    case '2':
    case 'pnpm':
      return 'pnpm'
    case '3':
    case 'yarn':
      return 'yarn'
    default:
      console.log('⚠️  Invalid choice, defaulting to npm')
      return 'npm'
  }
}

// Files to copy
const filesToCopy = [
  'app/signin/page.tsx',
  'app/signup/page.tsx', 
  'app/unauthorized/page.tsx',
  'app/api/auth/[...all]/route.ts',
  'components/login-form.tsx',
  'lib/auth.ts',
  'lib/auth-client.ts',
  'lib/query-client.ts',
  'types/auth.ts',
  'hooks/queries.ts',
  'better-auth-basic-usage.md',
  'better-auth-implementation-guide.md'
]

// Create directories if they don't exist
const directories = [
  'app/signin',
  'app/signup',
  'app/unauthorized',
  'app/api/auth/[...all]',
  'components',
  'lib',
  'types',
  'hooks'
]

directories.forEach(dir => {
  const fullPath = path.join(projectRoot, dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`📁 Created directory: ${dir}`)
  }
})

// Copy files with overwrite confirmation
const copyFiles = async () => {
  console.log('')
  console.log('📄 Checking files to copy...')
  
  const results = {
    copied: [],
    overwritten: [],
    skipped: [],
    notFound: []
  }
  
  for (const file of filesToCopy) {
    const sourcePath = path.join(sourceDir, file)
    const destPath = path.join(projectRoot, file)
    
    if (fs.existsSync(sourcePath)) {
      if (fs.existsSync(destPath)) {
        console.log(`⚠️  File already exists: ${file}`)
        const overwrite = await askQuestion('Do you want to overwrite it? (y/N): ')
        
        if (overwrite.toLowerCase() === 'y' || overwrite.toLowerCase() === 'yes') {
          fs.copyFileSync(sourcePath, destPath)
          console.log(`✅ Overwritten: ${file}`)
          results.overwritten.push(file)
        } else {
          console.log(`⏭️  Skipped: ${file}`)
          results.skipped.push(file)
        }
      } else {
        // File doesn't exist, copy it
        fs.copyFileSync(sourcePath, destPath)
        console.log(`✅ Copied: ${file}`)
        results.copied.push(file)
      }
    } else {
      console.log(`⚠️  Warning: ${file} not found in source`)
      results.notFound.push(file)
    }
  }
  
  // Show summary
  console.log('')
  console.log('📊 File operation summary:')
  if (results.copied.length > 0) {
    console.log(`✅ Copied (${results.copied.length}): ${results.copied.join(', ')}`)
  }
  if (results.overwritten.length > 0) {
    console.log(`🔄 Overwritten (${results.overwritten.length}): ${results.overwritten.join(', ')}`)
  }
  if (results.skipped.length > 0) {
    console.log(`⏭️  Skipped (${results.skipped.length}): ${results.skipped.join(', ')}`)
  }
  if (results.notFound.length > 0) {
    console.log(`⚠️  Not found (${results.notFound.length}): ${results.notFound.join(', ')}`)
  }
  
  return results
}

// Install dependencies with selected package manager
const installDependencies = async (packageManager) => {
  console.log(`📦 Installing dependencies with ${packageManager}...`)
  try {
    const installCommand = packageManager === 'pnpm' 
      ? 'pnpm add better-auth @prisma/client'
      : packageManager === 'yarn'
      ? 'yarn add better-auth @prisma/client'
      : 'npm install better-auth @prisma/client'
    
    execSync(installCommand, { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully')
  } catch (error) {
    console.log('⚠️  Warning: Failed to install dependencies automatically')
    console.log(`Please run: ${packageManager} add better-auth @prisma/client`)
  }
}

// Generate Prisma schema
const generatePrismaSchema = () => {
  console.log('🔧 Generating Prisma schema...')
  try {
    execSync('npx @better-auth/cli generate', { stdio: 'inherit' })
    console.log('✅ Prisma schema generated successfully')
  } catch (error) {
    console.log('⚠️  Warning: Failed to generate Prisma schema automatically')
    console.log('Please run: npx @better-auth/cli generate')
  }
}

// Create .env.local template
const createEnvTemplate = () => {
  const envTemplate = `# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
`

  const envPath = path.join(projectRoot, '.env.local')
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate)
    console.log('📄 Created .env.local template')
  } else {
    console.log('⚠️  .env.local already exists, skipping template creation')
  }
}

// Main installation function
const main = async () => {
  try {
    // Ask for package manager
    const packageManager = await askPackageManager()
    
    // Copy files with overwrite confirmation
    await copyFiles()
    
    // Install dependencies
    await installDependencies(packageManager)
    
    // Generate Prisma schema
    generatePrismaSchema()
    
    // Create .env.local template
    createEnvTemplate()
    
    console.log('')
    console.log('🎉 Better Auth system installed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Update your .env.local with your actual values')
    console.log('2. Run: npx prisma generate')
    console.log('3. Run: npx prisma db push')
    console.log(`4. Start your development server: ${packageManager} run dev`)
    console.log('')
    console.log('Your auth pages are now available at:')
    console.log('- /signin - Sign in page')
    console.log('- /signup - Sign up page') 
    console.log('- /unauthorized - Unauthorized access page')
    console.log('')
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message)
  } finally {
    rl.close()
  }
}

// Run the installation
main()
