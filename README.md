# Steal a Brainrot - Web Application

A modern web application that displays all brainrots from the Roblox game "Steal a Brainrot" with animated images, names, categories, and prices.

## 📋 Project Status

**Status:** ✅ Environment Setup Complete - Ready for Development

## 🎯 Project Overview

This application scrapes data from the Roblox game "Steal a Brainrot" (Game ID: 109983668079237) and displays it in a beautiful, modern web interface with CSS/JavaScript animations.

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+** - React-based framework with SSR/SSG
- **TypeScript** (recommended) - Type safety
- **Framer Motion** - Smooth CSS/JavaScript animations
- **Tailwind CSS** (optional) - Modern styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Puppeteer** - Web scraping (JavaScript rendering required)
- **node-cron** - Weekly automated updates

### Database
- **PostgreSQL** - Relational database

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **WSL2** - Development environment

## 📁 Project Structure

```
steal-a-brainrot/
├── frontend/          # Next.js application
├── backend/           # Node.js/Express API
├── database/          # Database migrations and seeds
├── docker/            # Docker configurations
├── docs/              # Documentation
│   ├── PDR.md        # Product Design Report
│   ├── PLAN.md       # Development Plan
│   ├── TASKS.md      # Detailed Tasks
│   └── TODO.md       # To-Do Checklist
├── scripts/           # Utility scripts
└── README.md          # This file
```

## 🎨 Key Features

- ✅ Web scraping from Roblox game page
- ✅ CSS/JavaScript animations (Framer Motion)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Weekly automated data updates
- ✅ Docker containerization
- ✅ WSL2 compatible

## 📊 Decisions Made

1. **Data Source:** Web Scraping with **Puppeteer** ✅
2. **Animation Format:** CSS/JavaScript animations (Framer Motion)
3. **Update Frequency:** Weekly automated updates (node-cron)
4. **Deployment:** Local Docker (WSL2 environment)

> **Note:** Puppeteer was selected after analyzing the Roblox page structure. The page requires JavaScript rendering, making Puppeteer the appropriate choice over Cheerio. See [PAGE_ANALYSIS.md](./docs/PAGE_ANALYSIS.md) for details.

## 🚀 Getting Started

### Prerequisites

- ✅ WSL2 installed and configured
- ✅ Docker Desktop installed
- Node.js 18+ (optional - only needed for local development without Docker)
- Git

### Quick Start

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

3. **Stop services:**
   ```bash
   docker-compose down
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md) or [QUICK_START.md](./QUICK_START.md).

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes ⚡
- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[PDR.md](./PDR.md)** - Product Design Report with requirements and architecture
- **[PLAN.md](./PLAN.md)** - Detailed development plan with phases
- **[TASKS.md](./TASKS.md)** - Comprehensive task breakdown
- **[TODO.md](./TODO.md)** - Actionable checklist
- **[PAGE_ANALYSIS.md](./docs/PAGE_ANALYSIS.md)** - Roblox page structure analysis and Puppeteer decision
- **[SCRAPING_STRATEGY.md](./SCRAPING_STRATEGY.md)** - Web scraping implementation strategy
- **[DECISIONS.md](./DECISIONS.md)** - All project decisions with rationale

## 🔄 Development Phases

1. **Phase 1:** Research & Discovery
2. **Phase 2:** Environment Setup
3. **Phase 3:** Backend Development
4. **Phase 4:** Frontend Development
5. **Phase 5:** Integration & Testing
6. **Phase 6:** Docker Setup & Deployment
7. **Phase 7:** Final Polish & Launch

## 📝 Notes

- This project uses web scraping to collect data from Roblox
- Respectful scraping practices are implemented (rate limiting, proper headers)
- Data is updated weekly via automated cron jobs
- All images are stored locally in Docker volumes

## 🤝 Contributing

_Contributing guidelines will be added during development_

## 📄 License

_License information will be added during development_

---

**Last Updated:** Planning phase complete - Ready for development

