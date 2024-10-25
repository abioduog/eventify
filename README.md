Here's a comprehensive README.md for the Eventify project:

```markdown
# Eventify

Eventify is a modern event management platform built with Next.js, TypeScript, and Tailwind CSS. It provides a seamless experience for creating, managing, and attending events.

## Features

- 🌓 Dark/Light mode support
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design
- 🔒 Type-safe development with TypeScript
- 🎯 SEO optimized
- 🚀 Fast performance

## Tech Stack

- **Framework**: Next.js 15.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Theme Management**: next-themes
- **Form Handling**: react-hook-form with zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eventify.git
cd eventify
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:

```bash
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
eventify/
├── .next/
├── node_modules/
├── public/
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── theme-provider.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── header.tsx
│   │       └── theme-toggle.tsx
│   └── lib/
│       └── utils.ts
├── .eslintrc.json
├── .gitignore
├── components.json
├── next.config.js
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Theme

The project uses a custom theme system with CSS variables. You can modify the theme colors in:

```typescript:src/app/globals.css
startLine: 9
endLine: 63
```

### Components

UI components are built using shadcn/ui and can be customized in the `src/components/ui` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

```

This README provides a comprehensive overview of the project, its features, setup instructions, and customization options, while maintaining the existing project structure and configuration.
