#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';

// Import command modules
import promptsCommand from '../src/commands/prompts.js';
import guidesCommand from '../src/commands/guides.js';
import systemsCommand from '../src/commands/systems.js';

program
  .name('aypackage')
  .description('A CLI tool for sharing prompts, guides, and reusable systems')
  .version('1.0.0');

// Prompts command
program
  .command('prompts')
  .description('Browse and copy proven prompts')
  .action(promptsCommand);

// Guides command
program
  .command('guides')
  .description('Access framework-specific instruction guides')
  .argument('[guide-name]', 'Name of the guide to view directly')
  .action(guidesCommand);

// Systems command
program
  .command('systems')
  .description('Install reusable systems and components')
  .argument('[system-name]', 'Name of the system to install directly')
  .action(systemsCommand);

// Default help
program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('Examples:'));
  console.log('  $ aypackage prompts          # Browse AI prompts');
  console.log('  $ aypackage guides           # Access instruction guides');
  console.log('  $ aypackage systems          # Install systems');
  console.log('  $ aypackage systems tiptap   # Install TipTap system directly');
  console.log('');
  console.log(chalk.yellow('For more information, visit: https://github.com/ayautomate/aypackage'));
});

program.parse();
