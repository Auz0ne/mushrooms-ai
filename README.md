# Mushrooms AI - Premium Mushroom Supplements

A modern, AI-powered e-commerce application for premium mushroom supplements built with React, TypeScript, and Tailwind CSS.

## Features

- 🍄 Interactive mushroom supplement catalog
- 🤖 AI-powered chatbot for supplement recommendations
- 🛒 Shopping cart with archetype-based promotions
- 📱 Mobile-first responsive design
- 🎨 Beautiful animations with Framer Motion
- 🗄️ Supabase backend integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mushrooms-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Database Setup

The application uses Supabase for data storage. The database includes:

- `mushrooms` table: Contains mushroom information, effects, and media
- `archetypes` table: Defines user archetypes and bundle requirements

Run the migrations in the `supabase/migrations` folder to set up your database schema.

## Deployment

### Netlify (Recommended)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify, or connect your GitHub repository for automatic deployments.

### Other Platforms

The app can be deployed to any static hosting service that supports single-page applications:

- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Static data
└── lib/                # Third-party library configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.