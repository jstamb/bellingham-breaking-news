# Bellingham Breaking News

A high-performance news site built with Next.js 14, optimized for auto-posting via n8n automation and deployment on Google Cloud Run.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Docker / Google Cloud Run

## Features

- API endpoints for n8n automation (auto-posting)
- Duplicate article detection
- Dynamic sitemap generation
- SEO optimized with JSON-LD schemas
- Lazy loading images with external URL support
- Dark mode support
- Breaking news banner

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (recommend Neon DB)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_SITE_NAME="Bellingham Breaking News"
   API_SECRET_KEY="your-api-key"
   ```

3. Set up database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public

- `GET /api/posts` - List published posts
- `GET /api/posts/[slug]` - Get single post
- `GET /api/health` - Health check

### Protected (requires X-API-Key header)

- `POST /api/posts` - Create new post
- `PATCH /api/posts/[slug]` - Update post
- `DELETE /api/posts/[slug]` - Delete post
- `POST /api/posts/check` - Check for duplicates
- `POST /api/revalidate` - Trigger ISR revalidation

### n8n Integration

Send a POST request to `/api/posts` with:

```json
{
  "title": "Article Title",
  "content": "<p>HTML content</p>",
  "excerpt": "Short description",
  "category": "Local",
  "tags": ["tag1", "tag2"],
  "featuredImage": "https://example.com/image.jpg",
  "isBreaking": false
}
```

Headers:
```
X-API-Key: your-api-key
Content-Type: application/json
```

## Deployment

### Docker Build

```bash
docker build -t bellingham-breaking-news .
docker run -p 3000:3000 -e DATABASE_URL="..." bellingham-breaking-news
```

### Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/bellingham-breaking-news
gcloud run deploy bellingham-breaking-news \
  --image gcr.io/PROJECT_ID/bellingham-breaking-news \
  --set-env-vars DATABASE_URL="..."
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
