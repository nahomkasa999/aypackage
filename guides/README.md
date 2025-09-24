# Guides Directory

This directory contains framework-specific instruction guides extracted from large documentation files.

## Purpose

Instead of reading through entire documentation (like large llm.txt files), these guides provide only the relevant parts for specific frameworks and use cases.

## Structure

- Each guide should be framework-specific
- Use `.txt` or `.md` format
- Include step-by-step instructions
- Provide working code examples
- Keep guides focused and actionable

## Example

```
guides/
├── authentication/
│   ├── better-auth-nextjs-guide.txt
│   ├── supabase-auth-setup.md
│   └── nextauth-v5-guide.txt
├── database/
│   ├── prisma-nextjs-setup.txt
│   └── supabase-database-guide.md
└── deployment/
    ├── vercel-nextjs-deploy.txt
    └── docker-nextjs-guide.md
```

## Creating New Guides

1. Extract relevant sections from large documentation
2. Make it framework-specific
3. Include working code examples
4. Test the guide end-to-end
5. Add clear step-by-step instructions
6. Update this README

## Future Features

- Interactive guide browser
- Progress tracking
- Code snippet copying
- Framework detection and recommendations
