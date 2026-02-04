# Backend - ESG News Analyzer

Express.js backend for ESG News Analyzer application.

## Features

- RESTful API for news aggregation
- MongoDB integration for data persistence
- NewsAPI integration for fetching articles
- ESG keyword filtering
- Duplicate article prevention

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/esg-news-analyzer
NEWS_API_KEY=your_newsapi_key
GEMINI_API_KEY=your_gemini_api_key
```

## Running

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST /api/news/search
Search and fetch news for a company
```json
{
  "companyName": "Tesla",
  "pageSize": 20
}
```

### GET /api/news/company/:companyName
Get stored news for a company

Query params: `?sentiment=Positive&esgCategory=Environmental&limit=50`

### GET /api/news/companies
Get all companies with news in database

### GET /api/news/stats/:companyName
Get statistics for a company

### GET /api/health
Health check endpoint

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── NewsArticle.js       # Mongoose schema
├── routes/
│   └── newsRoutes.js        # API routes
├── services/
│   └── newsService.js       # Business logic
├── server.js                # Entry point
├── package.json
└── .env
```

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- newsapi - NewsAPI client
- cors - CORS middleware
- dotenv - Environment variables
- axios - HTTP client

## ESG Keywords

The service filters articles using these keywords:
- ESG, sustainability, environmental
- Carbon, emissions, climate, renewable, pollution
- Diversity, inclusion, labor, human rights
- Governance, ethics, compliance, corruption
- Board, transparency, social responsibility
