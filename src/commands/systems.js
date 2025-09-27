import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (systemName) => {
  console.log(chalk.cyan('🔧 AYPackage Systems'));
  console.log(chalk.gray('Install reusable systems and components\n'));
  
  try {
    const systemsDir = path.join(__dirname, '../../systems');
    
    // Check if systems directory exists
    if (!await fs.pathExists(systemsDir)) {
      console.log(chalk.yellow('⚠️  No systems available yet.'));
      console.log(chalk.gray('Systems will be added in future updates.'));
      return;
    }
    
    const systemDirs = await fs.readdir(systemsDir);
    const validSystems = [];
    
    // Filter only directories
    for (const dir of systemDirs) {
      const dirPath = path.join(systemsDir, dir);
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        validSystems.push(dir);
      }
    }
    
    if (validSystems.length === 0) {
      console.log(chalk.yellow('⚠️  No systems available yet.'));
      console.log(chalk.gray('Systems will be added in future updates.'));
      return;
    }

    // If a specific system name is provided, try to install it directly
    if (systemName) {
      const systemDir = validSystems.find(system => 
        system.toLowerCase() === systemName.toLowerCase()
      );

      if (systemDir) {
        await installSystem(systemDir, systemsDir);
        return;
      } else {
        console.log(chalk.red(`❌ System "${systemName}" not found.`));
        console.log(chalk.gray('\nAvailable systems:'));
        validSystems.forEach((system, index) => {
          console.log(chalk.blue(`  ${index + 1}. ${system}`));
        });
        return;
      }
    }
    
    console.log(chalk.green(`Found ${validSystems.length} system(s):\n`));
    
    // Create choices for inquirer
    const choices = validSystems.map((system, index) => {
      return {
        name: `${index + 1}. ${system}`,
        value: system,
        short: system
      };
    });

    choices.push({ name: '─'.repeat(20), disabled: true });
    choices.push({
      name: 'Exit',
      value: 'exit'
    });

    try {
      const { selectedSystem } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedSystem',
          message: 'Select a system to install:',
          choices: choices,
          pageSize: 10
        }
      ]);

      if (selectedSystem === 'exit') {
        console.log(chalk.gray('\n👋 Goodbye!'));
        return;
      }

      // Install the selected system
      await installSystem(selectedSystem, systemsDir);
    } catch (inquirerError) {
      // If inquirer fails, show available systems and instructions
      console.log(chalk.yellow('\n⚠️  Interactive mode not available. Available systems:'));
      validSystems.forEach((system, index) => {
        console.log(chalk.blue(`  ${index + 1}. ${system}`));
      });
      console.log(chalk.gray('\n💡 Use: npx aypackage systems <system-name> to install a specific system'));
    }
    
  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.yellow('⚠️  Interactive mode not available. Showing available systems:'));
      const systemsDir = path.join(__dirname, '../../systems');
      const systemDirs = await fs.readdir(systemsDir);
      const validSystems = [];
      
      for (const dir of systemDirs) {
        const dirPath = path.join(systemsDir, dir);
        const stat = await fs.stat(dirPath);
        if (stat.isDirectory()) {
          validSystems.push(dir);
        }
      }

      validSystems.forEach((system, index) => {
        console.log(chalk.blue(`${index + 1}. ${system}`));
      });

      console.log(chalk.gray('\n💡 Use: npx aypackage systems <system-name> to install a specific system'));
    } else {
      console.error(chalk.red('Error reading systems:'), error.message);
    }
  }
};

async function installSystem(systemName, systemsDir) {
  try {
    const systemPath = path.join(systemsDir, systemName);
    const installerPath = path.join(systemPath, 'installer.js');

    // Check if installer exists
    if (!await fs.pathExists(installerPath)) {
      console.log(chalk.yellow(`⚠️  System "${systemName}" doesn't have an installer yet.`));
      console.log(chalk.gray('This system is not ready for installation.'));
      return;
    }

    // Load and run the installer
    const installerUrl = path.resolve(installerPath).replace(/\\/g, '/');
    const installer = await import(`file:///${installerUrl}`);
    
    if (typeof installer.installTipTap === 'function') {
      await installer.installTipTap();
    } else if (typeof installer.installBetterAuth === 'function') {
      await installer.installBetterAuth();
    } else if (typeof installer.default === 'function') {
      await installer.default();
    } else {
      console.log(chalk.red(`❌ Invalid installer for system "${systemName}".`));
    }

  } catch (error) {
    console.error(chalk.red(`Error installing system "${systemName}":`), error.message);
  }
}

