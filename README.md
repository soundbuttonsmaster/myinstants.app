# Meme Soundboard - memesoundboard.org

A modern, SEO-optimized Next.js website for playing meme sounds and sound effects.

## Features

- ✅ **Server-Side Rendering (SSR)** - Fast initial page loads and better SEO
- ✅ **Super SEO Optimized** - Complete metadata, Open Graph, Twitter Cards, Schema.org markup
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ✅ **Dark Mode** - Built-in theme switching
- ✅ **Modern UI/UX** - Beautiful gradient backgrounds and smooth animations
- ✅ **API Integration** - Connected to memesoundboard.org API endpoints

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **next-themes** - Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
memesoundboard.org/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page (SSR)
│   ├── globals.css        # Global styles
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap generation
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── sound/            # SoundButton, SoundGrid
│   └── ui/               # Theme provider, theme toggle
├── lib/                  # Utilities and API client
│   ├── api/             # API client for backend
│   ├── types/           # TypeScript types
│   └── utils.ts         # Helper functions
└── public/              # Static assets
    └── sound-buttons/   # Sound button images
```

## API Integration

The project connects to the memesoundboard.org API at:
- Base URL: `https://play.soundboard.cloud/api/memesoundboard.org`

Key endpoints used:
- `/sounds/trending` - Get trending sounds
- `/sounds/new` - Get new sounds
- `/sounds` - Get all sounds with filters
- `/sounds/{id}` - Get sound details

## SEO Features

- ✅ Complete metadata (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Schema.org structured data
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ Canonical URLs
- ✅ Mobile-friendly viewport settings

## Environment Variables

No environment variables required for basic functionality. The API base URL is configured in `lib/api/client.ts`.

## License

ISC

## Support

For issues or questions, please refer to the API documentation in `memesoundboard_org_api_endpoints.md`.
