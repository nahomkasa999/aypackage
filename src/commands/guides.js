const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

module.exports = async (guideName) => {
  console.log(chalk.cyan('📚 AYPackage Guides'));
  console.log(chalk.gray('Access framework-specific instruction guides\n'));
  
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
    
    // If a specific guide name is provided, try to find and display it
    if (guideName) {
      const guideFile = validGuides.find(file => {
        const fileName = file.replace(/\.(txt|md)$/, '');
        return fileName.toLowerCase() === guideName.toLowerCase();
      });
      
      if (guideFile) {
        await displayGuide(guideFile, guidesDir);
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
    
    choices.push(new inquirer.Separator('─'));
    choices.push({
      name: 'Exit',
      value: 'exit'
    });
    
    const { selectedGuide } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedGuide',
        message: 'Select a guide to view:',
        choices: choices,
        pageSize: 10
      }
    ]);
    
    if (selectedGuide === 'exit') {
      console.log(chalk.gray('\n👋 Goodbye!'));
      return;
    }
    
    // Display the selected guide
    await displayGuide(selectedGuide, guidesDir);
    
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
      
      console.log(chalk.gray('\n💡 Use: npx aypackage guides <guide-name> to view a specific guide'));
    } else {
      console.error(chalk.red('Error reading guides:'), error.message);
    }
  }
};

async function displayGuide(guideFile, guidesDir) {
  try {
    const guidePath = path.join(guidesDir, guideFile);
    const guideContent = await fs.readFile(guidePath, 'utf8');
    const fileName = guideFile.replace(/\.(txt|md)$/, '');
    
    console.log(chalk.cyan(`\n📖 ${fileName}`));
    console.log(chalk.gray('='.repeat(50)));
    console.log(guideContent);
    console.log(chalk.gray('='.repeat(50)));
    
    // Ask if user wants to copy to clipboard (only if interactive mode is available)
    try {
      const { copyToClipboard } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'copyToClipboard',
          message: 'Would you like to copy this guide to your clipboard?',
          default: false
        }
      ]);
      
      if (copyToClipboard) {
        try {
          const { exec } = require('child_process');
          const { promisify } = require('util');
          const execAsync = promisify(exec);
          
          // Try to copy to clipboard using system command
          if (process.platform === 'win32') {
            await execAsync(`echo "${guideContent.replace(/"/g, '\\"')}" | clip`);
          } else if (process.platform === 'darwin') {
            await execAsync(`echo "${guideContent.replace(/"/g, '\\"')}" | pbcopy`);
          } else {
            await execAsync(`echo "${guideContent.replace(/"/g, '\\"')}" | xclip -selection clipboard`);
          }
          
          console.log(chalk.green('✅ Guide copied to clipboard!'));
        } catch (clipboardError) {
          console.log(chalk.yellow('⚠️  Could not copy to clipboard automatically.'));
          console.log(chalk.gray('You can manually copy the content above.'));
        }
      }
    } catch (inquirerError) {
      // If inquirer fails, just show the content without clipboard option
      console.log(chalk.gray('\n💡 You can manually copy the content above.'));
    }
    
  } catch (error) {
    console.error(chalk.red('Error reading guide:'), error.message);
  }
}
