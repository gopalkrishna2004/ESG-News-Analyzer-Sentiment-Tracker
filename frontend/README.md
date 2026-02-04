# Frontend - ESG News Analyzer

React.js frontend for ESG News Analyzer application.

## Features

- Company search interface
- News article cards with metadata
- Responsive design (mobile & desktop)
- Loading states and error handling
- Quick search with popular companies
- Toggle between new/stored articles

## Installation

```bash
npm install
```

## Running

Development mode:
```bash
npm start
```

Runs on http://localhost:3000

Build for production:
```bash
npm build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CompanySearch.js     # Search form component
│   │   ├── CompanySearch.css
│   │   ├── NewsList.js          # List container
│   │   ├── NewsList.css
│   │   ├── NewsCard.js          # Individual article card
│   │   ├── NewsCard.css
│   │   ├── LoadingSpinner.js    # Loading indicator
│   │   └── LoadingSpinner.css
│   ├── App.js                   # Main app component
│   ├── App.css
│   ├── index.js                 # Entry point
│   └── index.css                # Global styles
├── package.json
└── .gitignore
```

## Components

### CompanySearch
- Search input for company name
- Radio buttons for search type (new/stored)
- Quick search chips for popular companies
- Handles API calls to backend

### NewsList
- Container for article cards
- Displays article count and company name
- Responsive grid layout

### NewsCard
- Individual article display
- Shows title, description, source, date
- Sentiment and ESG badges (when available)
- AI summary section (when available)
- External link to full article

### LoadingSpinner
- Animated loading indicator
- Displays while fetching data

## Styling

- Modern gradient background
- Card-based UI with shadows
- Hover effects and transitions
- Responsive breakpoints at 768px
- Color scheme: Purple gradient (#667eea to #764ba2)

## API Integration

Backend proxy configured in package.json:
```json
"proxy": "http://localhost:5000"
```

All API calls go through axios:
- `/api/news/search` - Fetch new articles
- `/api/news/company/:name` - Get stored articles

## Future Enhancements

- Dashboard with charts (Chart.js)
- Filters for sentiment and ESG categories
- Date range selector
- Export functionality
- User watchlist
