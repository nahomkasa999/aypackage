import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (guideName) => {
  console.log(chalk.cyan('📚 AYPackage Guides'));
  console.log(chalk.gray('Install framework-specific instruction guides to your project\n'));
  
  try {
    const guidesDir = path.join(__dirname, '../../guides');
    
    // Check if guides directory exists
    if (!await fs.pathExists(guidesDir)) {
      console.log(chalk.yellow('⚠️  No guides available yet.'));
      console.log(chalk.gray('Guides will be added in future updates.'));
      return;
    }
    
    const guideFiles = await fs.readdir(guidesDir);
    const validGuides = guideFiles.filter(file => 
      file.endsWith('.md') || file.endsWith('.txt')
    );
    
    if (validGuides.length === 0) {
      console.log(chalk.yellow('⚠️  No guides available yet.'));
      console.log(chalk.gray('Guides will be added in future updates.'));
      return;
    }
    
    // If a specific guide name is provided, try to find and install it
    if (guideName) {
      const guideFile = validGuides.find(file => {
        const fileName = file.replace(/\.(txt|md)$/, '');
        return fileName.toLowerCase() === guideName.toLowerCase();
      });
      
      if (guideFile) {
        await installGuide(guideFile, guidesDir);
        return;
      } else {
        console.log(chalk.red(`❌ Guide "${guideName}" not found.`));
        console.log(chalk.gray('\nAvailable guides:'));
        validGuides.forEach((file, index) => {
          const fileName = file.replace(/\.(txt|md)$/, '');
          console.log(chalk.blue(`  ${index + 1}. ${fileName}`));
        });
        return;
      }
    }
    
    console.log(chalk.green(`Found ${validGuides.length} guide(s):\n`));
    
    // Create choices for inquirer
    const choices = validGuides.map((file, index) => {
      const fileName = file.replace(/\.(txt|md)$/, '');
      return {
        name: `${index + 1}. ${fileName}`,
        value: file,
        short: fileName
      };
    });
    
    choices.push({ name: '─'.repeat(20), disabled: true });
    choices.push({
      name: 'Exit',
      value: 'exit'
    });
    
    try {
      const { selectedGuide } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedGuide',
          message: 'Select a guide to install:',
          choices: choices,
          pageSize: 10
        }
      ]);
      
      if (selectedGuide === 'exit') {
        console.log(chalk.gray('\n👋 Goodbye!'));
        return;
      }
      
      // Install the selected guide
      await installGuide(selectedGuide, guidesDir);
    } catch (inquirerError) {
      // If inquirer fails, show available guides and instructions
      console.log(chalk.yellow('\n⚠️  Interactive mode not available. Available guides:'));
      validGuides.forEach((file, index) => {
        const fileName = file.replace(/\.(txt|md)$/, '');
        console.log(chalk.blue(`  ${index + 1}. ${fileName}`));
      });
      console.log(chalk.gray('\n💡 Use: npx aypackage guides <guide-name> to install a specific guide'));
    }
    
  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.yellow('⚠️  Interactive mode not available. Showing available guides:'));
      const guidesDir = path.join(__dirname, '../../guides');
      const guideFiles = await fs.readdir(guidesDir);
      const validGuides = guideFiles.filter(file => 
        file.endsWith('.md') || file.endsWith('.txt')
      );
      
      validGuides.forEach((file, index) => {
        const fileName = file.replace(/\.(txt|md)$/, '');
        console.log(chalk.blue(`${index + 1}. ${fileName}`));
      });
      
      console.log(chalk.gray('\n💡 Use: npx aypackage guides <guide-name> to install a specific guide'));
    } else {
      console.error(chalk.red('Error reading guides:'), error.message);
    }
  }
};

async function installGuide(guideFile, guidesDir) {
  try {
    const guidePath = path.join(guidesDir, guideFile);
    const guideContent = await fs.readFile(guidePath, 'utf8');
    const fileName = guideFile.replace(/\.(txt|md)$/, '');
    
    // Get current working directory
    const currentDir = process.cwd();
    
    // Create guides directory if it doesn't exist
    const guidesDirPath = path.join(currentDir, 'guides');
    await fs.ensureDir(guidesDirPath);
    
    // Create the guide file
    const outputPath = path.join(guidesDirPath, guideFile);
    
    // Check if file already exists
    if (await fs.pathExists(outputPath)) {
      try {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `Guide "${fileName}" already exists. Do you want to overwrite it?`,
            default: false
          }
        ]);
        
        if (!overwrite) {
          console.log(chalk.yellow('❌ Installation cancelled.'));
          return;
        }
      } catch (inquirerError) {
        // If inquirer fails, just overwrite
        console.log(chalk.yellow(`⚠️  Guide "${fileName}" already exists. Overwriting...`));
      }
    }
    
    // Write the guide file
    await fs.writeFile(outputPath, guideContent, 'utf8');
    
    console.log(chalk.green(`✅ Guide "${fileName}" installed successfully!`));
    console.log(chalk.gray(`📁 Location: ${outputPath}`));
    console.log(chalk.gray(`\n💡 You can now open and use this guide in your project.`));
    
    // Ask if user wants to open the file
    try {
      const { openFile } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'openFile',
          message: 'Would you like to open the guide file?',
          default: false
        }
      ]);
      
      if (openFile) {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        try {
          if (process.platform === 'win32') {
            await execAsync(`start "" "${outputPath}"`);
          } else if (process.platform === 'darwin') {
            await execAsync(`open "${outputPath}"`);
          } else {
            await execAsync(`xdg-open "${outputPath}"`);
          }
          console.log(chalk.green('📖 Guide opened in your default editor!'));
        } catch (openError) {
          console.log(chalk.yellow('⚠️  Could not open the file automatically.'));
          console.log(chalk.gray(`You can manually open: ${outputPath}`));
        }
      }
    } catch (inquirerError) {
      // If inquirer fails, just continue
    }
    
  } catch (error) {
    console.error(chalk.red('Error installing guide:'), error.message);
  }
}
