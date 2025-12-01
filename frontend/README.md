# Frontend Application
## Steal a Brainrot - Next.js Frontend

### Overview

Modern Next.js 14 frontend application with Framer Motion animations for displaying brainrots from the Roblox game.

### Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ CSS/JavaScript animations with Framer Motion
- ✅ Real-time data fetching from backend API
- ✅ Category filtering
- ✅ Loading states and error handling
- ✅ Beautiful gradient UI

### Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.js            # Main page
│   │   ├── layout.js           # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/             # React components
│   │   ├── Header.js          # Navigation header
│   │   ├── Footer.js           # Page footer
│   │   ├── BrainrotCard.js    # Individual brainrot card
│   │   ├── BrainrotGrid.js    # Grid layout
│   │   ├── CategoryFilter.js  # Category filter
│   │   ├── Loading.js          # Loading states
│   │   └── Error.js           # Error display
│   ├── hooks/                  # Custom React hooks
│   │   └── useBrainrots.js    # Data fetching hooks
│   └── lib/                    # Utilities
│       └── api.js             # API client
├── package.json
├── next.config.js
├── tailwind.config.js
└── Dockerfile
```

---

## Components

### BrainrotCard
- Animated card with hover effects
- Image display with fallback
- Category badge
- Price display
- Framer Motion animations

### BrainrotGrid
- Responsive grid layout
- Staggered animations
- Loading skeleton
- Error handling

### CategoryFilter
- Dynamic category buttons
- Active state styling
- Smooth animations

---

## Animations

All animations are implemented using Framer Motion:

- **Card Entrance:** Staggered fade-in and scale
- **Hover Effects:** Scale and lift on hover
- **Image Zoom:** Scale on card hover
- **Button Interactions:** Scale on click
- **Loading Spinner:** Rotating animation

---

## API Integration

The frontend uses a custom API client (`src/lib/api.js`) to communicate with the backend:

- `getBrainrots(params)` - Fetch brainrots with filters
- `getBrainrot(id)` - Fetch single brainrot
- `getCategories()` - Fetch categories
- `triggerUpdate()` - Trigger data update
- `healthCheck()` - Check API health

---

## Custom Hooks

### useBrainrots
Fetches brainrots data with loading and error states:
```javascript
const { brainrots, loading, error, pagination } = useBrainrots({
  category: 'Rare',
  limit: 50
});
```

### useCategories
Fetches categories with counts:
```javascript
const { categories, loading, error } = useCategories();
```

---

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS** for global styles and scrollbar
- **Gradient backgrounds** for modern look
- **Responsive breakpoints:**
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large: 4 columns

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Steal a Brainrot
```

---

## Docker

### Build
```bash
docker build -t steal-a-brainrot-frontend .
```

### Run
```bash
docker run -p 3000:3000 steal-a-brainrot-frontend
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance

- Image optimization with Next.js Image component
- Lazy loading for better performance
- Code splitting with Next.js
- Optimized animations (60fps target)

---

## Notes

- Images are served from backend API
- API URL is configurable via environment variable
- All animations are GPU-accelerated
- Responsive design works on all screen sizes

