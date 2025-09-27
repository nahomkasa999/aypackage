#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import systemsCommand from '../src/commands/systems.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: npx aypackage <command> [options]')
  console.log('')
  console.log('Available commands:')
  console.log('  systems [system-name]    List or install systems')
  console.log('  prompts                  List available prompts')
  console.log('  guides                   List available guides')
  console.log('')
  process.exit(1)
}

const [command, ...options] = args

switch (command) {
  case 'systems':
    await systemsCommand(options[0])
    break
  case 'prompts':
    console.log('📝 Prompts feature coming soon!')
    break
  case 'guides':
    console.log('📚 Guides feature coming soon!')
    break
  default:
    console.log(`❌ Unknown command: ${command}`)
    console.log('')
    console.log('Available commands:')
    console.log('  systems [system-name]    List or install systems')
    console.log('  prompts                  List available prompts')
    console.log('  guides                   List available guides')
    console.log('')
    process.exit(1)
}