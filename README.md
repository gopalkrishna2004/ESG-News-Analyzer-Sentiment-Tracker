# ESG News Analyzer & Sentiment Tracker

A full-stack web application that aggregates, analyzes, and visualizes ESG (Environmental, Social, and Governance) news articles for companies. The application provides real-time sentiment analysis, ESG categorization, and AI-powered summarization using Google's Gemini AI.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Workflow & Architecture](#-workflow--architecture)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [License](#-license)

## ✨ Features

### Core Features
- **Company News Aggregation**: Fetch ESG-related news articles for any company using NewsAPI
- **Sentiment Analysis**: AI-powered sentiment classification (Positive, Negative, Neutral) using Hugging Face Transformers
- **ESG Categorization**: Automatic categorization into Environmental, Social, and Governance topics using Google Gemini AI
- **Smart Summarization**: Generate concise summaries of articles using Google Gemini AI
- **Analytics Dashboard**: Visualize sentiment trends and ESG distribution with interactive charts
- **Duplicate Prevention**: Intelligent deduplication based on title and URL similarity
- **Data Persistence**: MongoDB storage for historical data and offline access

### User Interface
- **Modern React UI**: Clean, responsive design with intuitive navigation
- **Unified Analyzer**: Single-page tool for comprehensive company analysis
- **Real-time Updates**: Live data fetching with loading states
- **Interactive Charts**: Visualize data using Chart.js and Recharts
- **Filtering & Search**: Filter articles by sentiment, ESG category, and keywords

## 🛠 Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API requests
- **Chart.js & Recharts** - Data visualization
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18** - Web framework
- **MongoDB** - Database
- **Mongoose 8.0** - ODM for MongoDB

### APIs & AI Services
- **NewsAPI** - News aggregation
- **Google Gemini AI** - ESG categorization and summarization
- **Hugging Face Transformers** - Sentiment analysis

### Development Tools
- **Nodemon** - Auto-restart server on changes
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
News/
├── backend/
│   ├── config/
│   │   └── database.js              # MongoDB connection setup
│   ├── models/
│   │   └── NewsArticle.js           # Mongoose schema for news articles
│   ├── routes/
│   │   ├── newsRoutes.js            # News endpoints
│   │   ├── sentimentRoutes.js       # Sentiment analysis endpoints
│   │   ├── esgRoutes.js             # ESG categorization endpoints
│   │   ├── analyticsRoutes.js       # Analytics & statistics endpoints
│   │   └── summaryRoutes.js         # Summarization endpoints
│   ├── services/
│   │   ├── newsService.js           # News fetching business logic
│   │   ├── sentimentService.js      # Sentiment analysis logic
│   │   ├── esgCategorizationService.js  # ESG categorization logic
│   │   └── summaryService.js        # Summarization logic
│   ├── server.js                    # Express server entry point
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompanySearch.js     # Company search component
│   │   │   ├── NewsCard.js          # Individual news article card
│   │   │   ├── NewsList.js          # List of news articles
│   │   │   ├── Sidebar.js           # Navigation sidebar
│   │   │   ├── LoadingSpinner.js    # Loading indicator
│   │   │   └── UnifiedAnalyzer.js   # Unified analysis tool
│   │   ├── pages/
│   │   │   ├── HomePage.js          # Landing page
│   │   │   ├── NewsPage.js          # News display page
│   │   │   └── DashboardPage.js     # Analytics dashboard
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── *.css                    # Component styles
│   ├── package.json
│   └── .gitignore
│
├── README.md                        # This file
└── .gitignore
```

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**

### API Keys Required

1. **NewsAPI Key** - Get it from [NewsAPI.org](https://newsapi.org/)
2. **Google Gemini API Key** - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd News
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/esg-news-analyzer
NEWS_API_KEY=your_newsapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
NODE_ENV=development
```

**Configuration Options:**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/esg-news-analyzer` |
| `NEWS_API_KEY` | Your NewsAPI key | Required |
| `GEMINI_API_KEY` | Your Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.5-flash-lite` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` (defined in `frontend/package.json`).

If your backend runs on a different port, update the `proxy` field in `frontend/package.json`:

```json
{
  "proxy": "http://localhost:YOUR_PORT"
}
```

## 🏃 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Option 2: Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Run Backend in Production Mode:**
```bash
cd backend
npm start
```

### Verify Installation

1. Check backend health: `http://localhost:5000/api/health`
2. Open frontend: `http://localhost:3000`

## 🔄 Workflow & Architecture

### Application Flow

```
┌─────────────┐
│   User      │
│  Interface  │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP Requests
       ▼
┌─────────────────────────────────────┐
│     Express.js Backend              │
│  ┌────────────────────────────┐    │
│  │   Routes Layer             │    │
│  │  - News Routes             │    │
│  │  - Sentiment Routes        │    │
│  │  - ESG Routes              │    │
│  │  - Analytics Routes        │    │
│  │  - Summary Routes          │    │
│  └────────┬───────────────────┘    │
│           │                         │
│  ┌────────▼───────────────────┐    │
│  │   Services Layer           │    │
│  │  - News Service            │    │
│  │  - Sentiment Service       │    │
│  │  - ESG Categorization      │    │
│  │  - Summary Service         │    │
│  └────────┬───────────────────┘    │
│           │                         │
└───────────┼─────────────────────────┘
            │
     ┌──────┴──────┬──────────────┐
     │             │              │
     ▼             ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ MongoDB │  │ NewsAPI  │  │ Gemini   │
│         │  │          │  │ AI API   │
└─────────┘  └──────────┘  └──────────┘
```

### Data Processing Pipeline

1. **User Input**: User searches for a company
2. **News Fetching**: Backend queries NewsAPI with ESG keywords
3. **Deduplication**: Check against existing articles in MongoDB
4. **AI Processing** (Parallel):
   - Sentiment Analysis (Hugging Face)
   - ESG Categorization (Gemini AI)
   - Content Summarization (Gemini AI)
5. **Storage**: Save processed articles to MongoDB
6. **Response**: Return enriched data to frontend
7. **Visualization**: Display articles, charts, and analytics

### ESG Keyword Filtering

The application filters news using these keywords:
- **Environmental**: carbon, emissions, climate, renewable, pollution, sustainability
- **Social**: diversity, inclusion, labor, human rights, community
- **Governance**: ethics, compliance, corruption, board, transparency, ESG

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "ESG News Analyzer API is running",
  "timestamp": "2026-02-05T10:00:00.000Z"
}
```

#### Search News
```http
POST /api/news/search
```
Fetch and process news articles for a company.

**Request Body:**
```json
{
  "companyName": "Tesla",
  "pageSize": 20
}
```

**Response:**
```json
{
  "success": true,
  "articles": [...],
  "count": 15
}
```

#### Get Company News
```http
GET /api/news/company/:companyName
```
Retrieve stored news articles for a company.

**Query Parameters:**
- `sentiment` - Filter by sentiment (Positive, Negative, Neutral)
- `esgCategory` - Filter by category (Environmental, Social, Governance)
- `limit` - Number of articles to return (default: 50)

**Example:**
```
GET /api/news/company/Tesla?sentiment=Positive&esgCategory=Environmental&limit=10
```

#### Get All Companies
```http
GET /api/news/companies
```
Get list of all companies with stored news.

**Response:**
```json
{
  "success": true,
  "companies": ["Tesla", "Apple", "Microsoft"]
}
```

#### Get Company Statistics
```http
GET /api/news/stats/:companyName
```
Get sentiment and ESG statistics for a company.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalArticles": 45,
    "sentimentCounts": {
      "Positive": 20,
      "Negative": 10,
      "Neutral": 15
    },
    "esgCounts": {
      "Environmental": 25,
      "Social": 12,
      "Governance": 8
    }
  }
}
```

#### Analyze Sentiment
```http
POST /api/sentiment/analyze
```
Analyze sentiment of a text.

**Request Body:**
```json
{
  "text": "Article text here..."
}
```

#### Categorize ESG
```http
POST /api/esg/categorize
```
Categorize article into ESG topics.

**Request Body:**
```json
{
  "title": "Article title",
  "description": "Article description"
}
```

#### Generate Summary
```http
POST /api/summary/generate
```
Generate AI summary of an article.

**Request Body:**
```json
{
  "title": "Article title",
  "description": "Article description",
  "content": "Full article content"
}
```

## 💻 Development

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd backend
npm run dev
```

**Frontend (with hot reload):**
```bash
cd frontend
npm start
```

### Testing

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Code Style

- Follow standard JavaScript/React conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components modular and reusable

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes in appropriate service/component
3. Test thoroughly
4. Commit with descriptive message
5. Create pull request

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**API Key Errors:**
- Verify API keys are valid and not expired
- Check rate limits on NewsAPI and Gemini

**Port Already in Use:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process (Windows)
taskkill /PID <PID> /F
```

**CORS Issues:**
- Verify proxy setting in frontend `package.json`
- Check CORS middleware in backend

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for ESG-conscious investing and corporate transparency**
