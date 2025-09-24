import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TipTap packages and their versions
const TIPTAP_PACKAGES = {
  '@tiptap/react': '^3.4.5',
  '@tiptap/starter-kit': '^3.4.5',
  '@tiptap/extension-image': '^3.4.5',
  '@tiptap/extension-link': '^3.4.5',
  '@tiptap/extension-code-block-lowlight': '^3.4.5',
  '@tiptap/extension-text-align': '^3.4.5',
  '@tiptap/extension-underline': '^3.4.5',
  '@tiptap/extension-placeholder': '^3.4.5',
  'lowlight': '^3.3.0'
};

// Feature definitions
const FEATURES = {
  basicFormatting: {
    name: 'Basic Formatting',
    description: 'Bold, italic, underline, strikethrough, code',
    packages: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-underline']
  },
  headings: {
    name: 'Headings',
    description: 'H1, H2, H3 support',
    packages: ['@tiptap/react', '@tiptap/starter-kit']
  },
  lists: {
    name: 'Lists',
    description: 'Bullet lists and ordered lists',
    packages: ['@tiptap/react', '@tiptap/starter-kit']
  },
  media: {
    name: 'Media',
    description: 'Images and links',
    packages: ['@tiptap/react', '@tiptap/extension-image', '@tiptap/extension-link']
  },
  codeBlocks: {
    name: 'Code Blocks',
    description: 'Code blocks with syntax highlighting',
    packages: ['@tiptap/react', '@tiptap/extension-code-block-lowlight', 'lowlight']
  },
  textAlignment: {
    name: 'Text Alignment',
    description: 'Left, center, right, justify',
    packages: ['@tiptap/react', '@tiptap/extension-text-align']
  },
  blocks: {
    name: 'Blocks',
    description: 'Blockquotes and code blocks',
    packages: ['@tiptap/react', '@tiptap/starter-kit']
  },
  actions: {
    name: 'Actions',
    description: 'Undo/redo functionality',
    packages: ['@tiptap/react', '@tiptap/starter-kit']
  }
};

async function installTipTap() {
  console.log(chalk.cyan('🔧 TipTap Rich Text Editor System'));
  console.log(chalk.gray('Install a complete TipTap rich text editor with all features\n'));

  try {
    // Ask for installation type
    const { installationType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'installationType',
        message: 'Choose installation type:',
        choices: [
          {
            name: '✨ Recommended (All Features)',
            value: 'recommended',
            short: 'Recommended'
          },
          {
            name: '🎯 Custom (Select Features)',
            value: 'custom',
            short: 'Custom'
          }
        ]
      }
    ]);

    let selectedFeatures = [];
    let selectedPackages = new Set();

    if (installationType === 'recommended') {
      // Select all features for recommended installation
      selectedFeatures = Object.keys(FEATURES);
      selectedPackages = new Set(Object.keys(TIPTAP_PACKAGES));
      
      console.log(chalk.green('✅ Selected: All features (Recommended)'));
    } else {
      // Custom feature selection
      const { features } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'features',
          message: 'Select the features you need:',
          choices: Object.entries(FEATURES).map(([key, feature]) => ({
            name: `${feature.name} - ${feature.description}`,
            value: key,
            checked: false
          })),
          validate: (answer) => {
            if (answer.length === 0) {
              return 'Please select at least one feature.';
            }
            return true;
          }
        }
      ]);

      selectedFeatures = features;
      
      // Collect all required packages
      selectedFeatures.forEach(featureKey => {
        FEATURES[featureKey].packages.forEach(pkg => {
          selectedPackages.add(pkg);
        });
      });

      console.log(chalk.green(`✅ Selected features: ${selectedFeatures.length}`));
    }

    // Get current working directory
    const currentDir = process.cwd();
    
    // Create components directory if it doesn't exist
    const componentsDir = path.join(currentDir, 'components', 'ui');
    await fs.ensureDir(componentsDir);

    // Check if rich-text-editor already exists
    const editorPath = path.join(componentsDir, 'rich-text-editor.tsx');
    if (await fs.pathExists(editorPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Rich text editor component already exists. Do you want to overwrite it?',
          default: false
        }
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('❌ Installation cancelled.'));
        return;
      }
    }

    // Copy the component file
    const templatePath = path.join(__dirname, 'nextjs', 'components', 'ui', 'rich-text-editor.tsx');
    await fs.copy(templatePath, editorPath);

    // Update package.json
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      // Add dependencies
      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
      }

      selectedPackages.forEach(pkg => {
        packageJson.dependencies[pkg] = TIPTAP_PACKAGES[pkg];
      });

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      console.log(chalk.green('✅ Updated package.json with TipTap dependencies'));
    }

    // Create usage example
    const exampleContent = `import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useState } from 'react'

export function ExampleForm() {
  const [content, setContent] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rich Text Editor Example</h2>
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder="Write your content here..."
      />
      <div className="text-sm text-muted-foreground">
        Content: {content.length} characters
      </div>
    </div>
  )
}`;

    const examplePath = path.join(currentDir, 'components', 'rich-text-editor-example.tsx');
    await fs.writeFile(examplePath, exampleContent);

    // Install shadcn/ui components
    console.log(chalk.gray('\n🎨 Installing required shadcn/ui components...'));
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // Check if pnpm is available, otherwise use npm
      let packageManager = 'npm';
      try {
        await execAsync('pnpm --version');
        packageManager = 'pnpm';
      } catch (error) {
        // pnpm not available, use npm
      }

      const shadcnCommand = packageManager === 'pnpm' 
        ? 'pnpm dlx shadcn@latest add button input'
        : 'npx shadcn@latest add button input';

      console.log(chalk.gray(`Running: ${shadcnCommand}`));
      await execAsync(shadcnCommand, { cwd: currentDir });
      console.log(chalk.green('✅ shadcn/ui components installed successfully!'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not install shadcn/ui components automatically.'));
      console.log(chalk.gray('Please run manually:'));
      console.log(chalk.blue('  pnpm dlx shadcn@latest add button input'));
      console.log(chalk.blue('  # or: npx shadcn@latest add button input'));
    }

    // Success message
    console.log(chalk.green('\n🎉 TipTap Rich Text Editor installed successfully!'));
    console.log(chalk.gray('\n📁 Files created:'));
    console.log(chalk.blue(`  • ${path.relative(currentDir, editorPath)}`));
    console.log(chalk.blue(`  • ${path.relative(currentDir, examplePath)}`));
    
    console.log(chalk.gray('\n📦 Dependencies added:'));
    Array.from(selectedPackages).forEach(pkg => {
      console.log(chalk.blue(`  • ${pkg}@${TIPTAP_PACKAGES[pkg]}`));
    });

    console.log(chalk.gray('\n🚀 Next steps:'));
    console.log(chalk.yellow('  1. Run: pnpm install (or npm install)'));
    console.log(chalk.yellow('  2. Import and use the RichTextEditor component'));
    console.log(chalk.yellow('  3. Check the example file for usage patterns'));

    console.log(chalk.gray('\n💡 Usage:'));
    console.log(chalk.blue('  import { RichTextEditor } from "@/components/ui/rich-text-editor"'));
    console.log(chalk.blue('  <RichTextEditor content={content} onChange={setContent} />'));

  } catch (error) {
    console.error(chalk.red('❌ Error installing TipTap:'), error.message);
  }
}

export { installTipTap };
