# 📊 ESG News Analyzer & Sentiment Tracker

A full-stack web application that aggregates ESG (Environmental, Social, Governance) news about companies and uses AI to analyze sentiment and categorize issues.

## 🚀 Features

### Feature 1: Company Search & News Aggregation ✅
- Search for companies by name
- Fetch ESG-related news articles from NewsAPI
- Display news articles with metadata
- Store news data in MongoDB database
- View stored articles or fetch new ones
- Quick search with sample companies (Tesla, Amazon, Microsoft, etc.)

### Features 2 & 3: Unified AI Analysis ✅
**One-Click Sentiment + ESG Analysis**
- ⚡ **Unified Analyzer** - Single button for both analyses (runs in parallel)
- 🤖 **Sentiment Analysis** - BERT AI: Positive/Negative/Neutral
- 🏷️ **ESG Categorization** - Gemini AI: Environmental/Social/Governance
- ⏱️ **Fast Processing** - Both analyses run simultaneously (~20-30 seconds)
- 🎨 **Color-coded Badges** - ✅❌➖ (sentiment) + 🌍👥⚖️ (ESG)
- 📦 **Batch Processing** - 10 articles at a time

### Feature 4: Trend Dashboard & Visualizations ✅
**Beautiful Analytics Dashboard with Recharts**
- 📈 **Sentiment Trends** - Line chart showing sentiment changes over time
- 🥧 **ESG Distribution** - Pie chart with percentage breakdown
- 📊 **Category Comparison** - Bar chart comparing E/S/G counts
- 📅 **Timeline View** - Chronological list of ESG events with badges
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Gradient backgrounds, smooth animations, hover effects
- 📊 **Overview Cards** - Quick stats for total articles and sentiment breakdown

### Coming Soon 🔜
- AI Summary Generation
- Alerts & Notifications
- Export Reports

## 🛠️ Tech Stack

**Frontend:**
- React.js with React Router
- Axios for API calls
- Recharts for beautiful visualizations
- Responsive CSS with gradients and animations

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- NewsAPI.org for news aggregation

**AI/ML:**
- Hugging Face Transformers.js (BERT) for sentiment analysis
- Google Gemini API for ESG categorization
- Local model execution (no external sentiment API needed)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gopalkrishna2004/ESG-News-Analyzer-Sentiment-Tracker.git
cd ESG-News-Analyzer-Sentiment-Tracker
```

### 2. Backend Setup

```bash
cd backend
npm install

# Install Hugging Face Transformers for sentiment analysis
npm install @huggingface/transformers
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/esg-news-analyzer
NEWS_API_KEY=your_newsapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
App will open on http://localhost:3000

## 📖 Usage

### Quick Start (3 Steps!)

**Step 1: Search**
```
Enter "Tesla" → Click Search
Result: 10 ESG-related articles fetched
```

**Step 2: Analyze**
```
Click: ⚡ Analyze All (Sentiment + ESG)
Wait: ~20-30 seconds
Both analyses run in parallel!
```

**Step 3: View**
```
Every article now shows:
├─ ✅ Positive (or ❌ Negative, ➖ Neutral)
└─ 🌍 Environmental (or 👥 Social, ⚖️ Governance)
```

📖 **Detailed Guide:** See `UNIFIED_ANALYSIS_QUICKSTART.md`

### Features:

1. **Search for Companies:**
   - Type company name or use quick search buttons
   - Choose: Fetch New or View Stored articles

2. **AI Analysis (One Click!):**
   - Click "⚡ Analyze All (Sentiment + ESG)"
   - Both analyses run simultaneously
   - Real-time progress tracking

3. **View Results:**
   - Color-coded sentiment badges
   - ESG category badges
   - Click "Read Full Article" for original source

## 🗄️ Database Schema

**NewsArticle Model:**
```javascript
{
  company: String,           // Company name
  title: String,            // Article title
  description: String,      // Short description
  content: String,          // Full content
  url: String,              // Article URL (unique)
  urlToImage: String,       // Image URL
  publishedAt: Date,        // Publication date
  source: {                 // News source
    name: String,
    id: String
  },
  author: String,           // Article author
  sentiment: String,        // Positive/Negative/Neutral (BERT AI)
  esgCategory: [String],    // Environmental/Social/Governance (Gemini AI)
  aiSummary: String         // AI-generated summary
}
```

## 🔌 API Endpoints

### Search & Fetch News
```
POST /api/news/search
Body: { companyName: "Tesla", pageSize: 20 }
```

### Get Stored News
```
GET /api/news/company/:companyName
Query Params: ?sentiment=Positive&esgCategory=Environmental&limit=50
```

### Get All Companies
```
GET /api/news/companies
```

### Get Statistics
```
GET /api/news/stats/:companyName
```

### Health Check
```
GET /api/health
```

## 📊 ESG Categories

- **Environmental (🌍):** Climate change, carbon emissions, pollution, waste management, renewable energy, water conservation
- **Social (👥):** Labor practices, diversity & inclusion, employee welfare, human rights, community relations, product safety
- **Governance (⚖️):** Board diversity, executive compensation, corruption, transparency, shareholder rights, business ethics

## 🎨 Screenshots

_(Screenshots will be added after implementation)_

## 🚧 Roadmap

- [x] Project setup (MERN stack)
- [x] Company search functionality
- [x] NewsAPI integration
- [x] MongoDB data storage
- [x] Responsive UI design
- [x] Sentiment analysis with Hugging Face (BERT)
- [x] ESG categorization with Gemini API
- [x] Multi-page navigation with React Router
- [x] Dashboard with Recharts (Line, Pie, Bar charts)
- [x] Timeline view of ESG events
- [x] Analytics API endpoints
- [ ] AI summary generation
- [ ] Email alerts system

## 🤝 Contributing

This is a college assignment project. Contributions are welcome for educational purposes.

## 📝 License

MIT License

## 👨‍💻 Author

Created as part of PS Assignment 2 - ESG News Analyzer & Sentiment Tracker

## 📚 Documentation

### Main Guides
- **`UNIFIED_ANALYSIS_QUICKSTART.md`** ⭐ - **START HERE!** One-click analysis walkthrough
- **`UNIFIED_ANALYSIS.md`** - Technical details of unified analyzer

### Feature Documentation
- **`FEATURE_2_SENTIMENT_ANALYSIS.md`** - Complete sentiment analysis docs
- **`FEATURE_3_ESG_CATEGORIZATION.md`** - Complete ESG categorization docs

### Troubleshooting
- **`NEUTRAL_SENTIMENT_LOGIC.md`** - Neutral sentiment detection explained
- **`FIX_HUGGINGFACE_ERROR.md`** - Model loading issues

## 🙏 Acknowledgments

- NewsAPI.org for news aggregation
- Hugging Face for Transformers.js and BERT models
- Google for Gemini API
- MongoDB for database
- React.js for frontend

---

**Note:** This application is built for educational purposes as part of a college assignment. Make sure to comply with NewsAPI terms of service and rate limits.
