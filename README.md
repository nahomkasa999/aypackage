# AYPackage

A CLI tool for sharing prompts, guides, and reusable systems across projects. Think of it as your personal knowledge base of proven solutions that you can quickly deploy in any project.

## 🚀 Installation

```bash
npm install -g aypackage
```

## 📖 Usage

```bash
# Browse and copy proven prompts
npx aypackage prompts

# Access framework-specific instruction guides  
npx aypackage guides

# Install reusable systems and components
npx aypackage systems
```

## 🎯 What is AYPackage?

AYPackage is designed to solve the problem of repetitive development tasks by providing three types of reusable resources:

### 1. 📝 Prompts
Human-written, proven prompts for AI tools. When you find a prompt that works exceptionally well, save it here and share it with your team.

**Example:**
- Content generation prompts
- Code review prompts  
- Debugging prompts
- Marketing copy prompts

### 2. 📚 Guides
Framework-specific instruction guides extracted from large documentation. Instead of reading through entire docs, get only the parts relevant to your framework.

**Example:**
- `better-auth-nextjs-guide.txt` - Only Next.js parts from BetterAuth docs
- `supabase-auth-setup.md` - Step-by-step Supabase auth setup
- `prisma-deployment-guide.txt` - Framework-specific Prisma deployment

### 3. 🔧 Systems
Complete, modular implementations of common project patterns. These are end-to-end solutions that you can import and use immediately.

**Example:**
- **Authentication System** - Complete auth setup with multiple providers
- **Rich Text Editor** - TipTap implementation with selected features
- **Database Setup** - Prisma schema and configuration
- **API Integration** - Common third-party service integrations

## 🏗️ System Structure

```
systems/
├── authentication/
│   ├── nextjs/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── README.md
│   └── react/
│       └── ...
├── rich-text-editor/
│   ├── nextjs/
│   │   ├── components/
│   │   ├── styles/
│   │   └── README.md
│   └── react/
│       └── ...
└── ...
```

## 🎮 Interactive Features (Coming Soon)

### System Installation Flow
```bash
npx aypackage systems authentication

# Interactive prompts:
# → Which framework? [Next.js, React, Vue, etc.]
# → Social providers? [y/n]
# → If yes: [Google, GitHub, Discord, etc.]
# → Database preferences? [Supabase, Prisma, etc.]
# → Install packages? [y/n]
# → Generate files and copy to clipboard
```

### Feature Selection
```bash
npx aypackage systems rich-text-editor

# → What features do you need?
#   ☐ Bold, Italic, Underline
#   ☐ Images, Links, Tables
#   ☐ Code blocks, Lists
#   ☐ Custom extensions
```

## 🎨 Philosophy

**Copy-Paste, Not Dependencies**: Unlike traditional packages, AYPackage gives you the actual code to own and modify. No black boxes, no version conflicts.

**Proven Solutions**: Every prompt, guide, and system has been tested and refined in real projects.

**Framework Agnostic**: Systems are organized by framework, so you get exactly what you need for your tech stack.

**Continuous Evolution**: As you build more projects, you'll add more systems, creating a growing library of proven solutions.

## 🚧 Current Status

This is the foundation release. The CLI structure is ready, and the framework is in place for:

- ✅ Basic CLI commands
- ✅ Directory structure
- ✅ Command framework
- 🔄 Interactive prompts (coming soon)
- 🔄 Code generation (coming soon)
- 🔄 Package management (coming soon)

## 🤝 Contributing

This package is designed for personal/organizational use. You can:

1. Add your own prompts to the `prompts/` directory
2. Create framework-specific guides in `guides/`
3. Build reusable systems in `systems/`
4. Share your proven solutions with your team

## 📄 License

MIT License - feel free to use and modify for your projects.

---

**Built by AYAutomate** - Making development more efficient, one system at a time.
