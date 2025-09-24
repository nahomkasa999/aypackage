#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

// Import command modules
const promptsCommand = require('../src/commands/prompts');
const guidesCommand = require('../src/commands/guides');
const systemsCommand = require('../src/commands/systems');

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
  .action(guidesCommand);

// Systems command
program
  .command('systems')
  .description('Install reusable systems and components')
  .action(systemsCommand);

// Default help
program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('Examples:'));
  console.log('  $ aypackage prompts          # Browse AI prompts');
  console.log('  $ aypackage guides           # Access instruction guides');
  console.log('  $ aypackage systems          # Install systems');
  console.log('');
  console.log(chalk.yellow('For more information, visit: https://github.com/ayautomate/aypackage'));
});

program.parse();
