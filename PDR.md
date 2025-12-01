# Product Design Report (PDR)
## Steal a Brainrot - Web Application

### 1. Project Overview

**Project Name:** Steal a Brainrot Web Application  
**Version:** 1.0  
**Date:** 2024  
**Status:** Planning Phase

### 2. Objective

Create a web application that displays all brainrots from the Roblox game "Steal a Brainrot" (Game ID: 109983668079237), showcasing each brainrot with:
- Animated images
- Name
- Category
- Price information

### 3. Scope

#### 3.1 In-Scope
- Display all brainrots from the game
- Show animated images for each brainrot
- Display brainrot names
- Display brainrot categories
- Display pricing information
- Responsive web design
- Docker containerization for deployment
- WSL environment compatibility

#### 3.2 Out-of-Scope (Initial Release)
- User authentication
- User accounts/profiles
- Purchase functionality
- Real-time game data synchronization
- User reviews/ratings
- Search and filtering (may be added later)

### 4. Target Users

- Roblox players interested in "Steal a Brainrot" game
- Collectors tracking brainrot items
- Game enthusiasts browsing available items

### 5. Functional Requirements

#### 5.1 Data Display
- **FR-1:** Display all brainrots in a grid/list view
- **FR-2:** Show animated image for each brainrot
- **FR-3:** Display brainrot name prominently
- **FR-4:** Display brainrot category with visual distinction
- **FR-5:** Display price information (if available)
- **FR-6:** Support responsive design for mobile/tablet/desktop

#### 5.2 Data Management
- **FR-7:** Fetch brainrot data via web scraping from Roblox game page
- **FR-8:** Store brainrot data in PostgreSQL database
- **FR-9:** Automatically refresh data weekly via scheduled task (node-cron)
- **FR-10:** Implement rate limiting and respectful scraping practices

### 6. Non-Functional Requirements

#### 6.1 Performance
- **NFR-1:** Page load time < 3 seconds
- **NFR-2:** Smooth animations (60fps)
- **NFR-3:** Efficient image loading and caching

#### 6.2 Compatibility
- **NFR-4:** Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-5:** WSL2 environment compatibility
- **NFR-6:** Docker Desktop integration

#### 6.3 Usability
- **NFR-7:** Intuitive navigation
- **NFR-8:** Clear visual hierarchy
- **NFR-9:** Accessible design (WCAG 2.1 AA)

### 7. Technical Architecture

#### 7.1 Technology Stack (Finalized)
- **Frontend:** Next.js 14+ (React-based, modern SSR/SSG, excellent DX)
- **Backend:** Node.js with Express.js (lightweight, modern, great ecosystem)
- **Database:** PostgreSQL (robust, reliable, excellent for structured data)
- **Web Scraping:** Puppeteer or Cheerio (for Roblox game page scraping)
- **Animation:** CSS/JavaScript animations (Framer Motion or CSS animations)
- **Containerization:** Docker & Docker Compose
- **Task Scheduler:** node-cron (for weekly data updates)

#### 7.2 System Architecture
```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│   (Node/Express)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
│  (PostgreSQL)   │
└─────────────────┘
         │
         ▲
         │
┌─────────────────┐
│  Web Scraper    │
│  (Puppeteer)    │
│  (Weekly Cron)  │
└─────────────────┘
```

### 8. Data Model

#### 8.1 Brainrot Entity
```
Brainrot {
  id: string (unique identifier)
  name: string
  category: string
  price: number (or null if free)
  imageUrl: string
  animationData: object (CSS/JS animation configuration)
  description: string (optional)
  gameId: string (109983668079237)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 9. User Interface Design

#### 9.1 Main Page
- Header with application title
- Grid/List view toggle
- Brainrot cards displaying:
  - Animated image (hover/click for full view)
  - Name
  - Category badge
  - Price badge
- Filter by category (future enhancement)
- Search functionality (future enhancement)

#### 9.2 Brainrot Card Design
- Card layout with hover effects
- Animated image as primary visual
- Name displayed prominently
- Category with color coding
- Price information clearly visible

### 10. Data Source Strategy

**Selected Method: Web Scraping**

**Implementation Details:**
- **Tool:** Puppeteer or Cheerio (depending on JavaScript rendering needs)
- **Target:** Roblox game page (https://www.roblox.com/games/109983668079237/Steal-a-Brainrot)
- **Rate Limiting:** Implement delays between requests, respect robots.txt
- **Update Frequency:** Weekly automated updates via cron job
- **Error Handling:** Retry logic, logging, graceful degradation
- **Data Extraction:**
  - Brainrot names
  - Categories
  - Prices
  - Image URLs
  - Animation data (if available in page structure)

**Scraping Considerations:**
- Compliance with Roblox Terms of Service
- User-Agent headers to identify as a bot
- Respectful request intervals
- Handle dynamic content loading
- Cache images locally after scraping

### 11. Deployment Strategy

#### 11.1 Development Environment
- WSL2 on Windows 11
- Docker Desktop integration
- Local development server

#### 11.2 Local Deployment (Current Scope)
- Docker containerization
- Multi-stage Docker builds
- Environment variable configuration
- Health check endpoints
- Docker Compose for multi-service orchestration
- Local volume mounts for data persistence
- WSL2 optimized configuration

### 12. Security Considerations

- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Secure image hosting/CDN
- Compliance with Roblox Terms of Service

### 13. Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Roblox page structure changes | High | Medium | Robust selectors, error handling, manual updates |
| Web scraping blocking/rate limits | High | Medium | Rate limiting, user-agent rotation, retry logic |
| Animation performance | Medium | Low | CSS/JS optimization, lazy loading, hardware acceleration |
| Data accuracy | Medium | Medium | Weekly updates, validation, manual review option |
| WSL/Docker compatibility | Low | Low | Test early, use standard tools, WSL2 optimized configs |
| Scraping legal/compliance | Medium | Low | Respect ToS, rate limiting, clear bot identification |

### 14. Success Criteria

- All brainrots displayed with correct information
- Animations work smoothly across devices
- Application loads quickly
- Responsive design works on all screen sizes
- Docker deployment successful in WSL environment

### 15. Timeline (Estimated)

- **Phase 1:** Research & Planning (1-2 days)
- **Phase 2:** Environment Setup (1 day)
- **Phase 3:** Backend Development (3-5 days)
- **Phase 4:** Frontend Development (3-5 days)
- **Phase 5:** Integration & Testing (2-3 days)
- **Phase 6:** Docker Setup & Deployment (1-2 days)

**Total Estimated Time:** 11-18 days

### 16. Dependencies

- WSL2 installed and configured
- Docker Desktop installed
- Access to Roblox game data (method TBD)
- Internet connection for development

### 17. Decisions Made

1. **Data Source:** ✅ Web Scraping (Puppeteer/Cheerio)
2. **Animation Format:** ✅ CSS/JavaScript animations (Framer Motion or CSS)
3. **Tech Stack:** ✅ Next.js (Frontend), Node.js/Express (Backend), PostgreSQL (Database)
4. **Update Frequency:** ✅ Weekly automated updates (node-cron)
5. **Deployment:** ✅ Local Docker deployment (WSL2 environment)

---

**Document Status:** ✅ Finalized - Ready for Development

