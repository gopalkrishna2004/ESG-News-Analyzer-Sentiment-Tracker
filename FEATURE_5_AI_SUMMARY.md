# Feature 5: AI Summary Generation

## Overview
This feature uses Google Gemini API to generate comprehensive, AI-powered summaries of ESG news for companies. It provides stakeholders with quick insights into key concerns, positive developments, and trending topics.

## Features Implemented

### 1. AI-Generated ESG Summary
- **Overall Summary**: A 2-3 sentence overview of the company's current ESG standing
- **Key Concerns**: Top 3 concerns or negative developments
- **Positive Highlights**: Top 3 positive developments or achievements
- **Trending Topics**: Top ESG topics with category, sentiment, and importance level
- **Recommendations**: Brief actionable recommendations for stakeholders

### 2. Backend Service (`backend/services/summaryService.js`)
- Uses Google Gemini API for intelligent text analysis
- Analyzes up to 50 most recent articles
- Provides structured JSON output with all key insights
- Includes fallback to basic summary if AI fails
- Singleton pattern for efficient API usage

### 3. API Endpoint
**GET** `/api/summary/:company`

**Response:**
```json
{
  "success": true,
  "company": "Tesla",
  "summary": {
    "overallSummary": "Overall ESG analysis...",
    "keyConcerns": ["concern 1", "concern 2", "concern 3"],
    "positiveHighlights": ["highlight 1", "highlight 2", "highlight 3"],
    "trendingTopics": [
      {
        "topic": "Climate initiatives",
        "category": "Environmental",
        "sentiment": "Positive",
        "importance": "High"
      }
    ],
    "recommendations": "Stakeholder recommendations..."
  },
  "analyzedArticles": 25,
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

### 4. Frontend Display (Dashboard)
The summary is displayed prominently on the dashboard page with:

#### Visual Components:
1. **Overall Summary Card**: Gradient background with the main summary
2. **Key Concerns Box**: Red-themed box listing major concerns
3. **Positive Highlights Box**: Green-themed box listing positive developments
4. **Trending Topics Grid**: Cards showing trending ESG topics with:
   - Topic name
   - ESG category (color-coded)
   - Sentiment indicator
   - Importance level (High/Medium/Low)
5. **Recommendations Section**: Yellow-themed box with stakeholder recommendations

## File Structure

```
backend/
├── services/
│   └── summaryService.js          # AI summary generation logic
├── routes/
│   └── summaryRoutes.js           # API endpoints for summaries
└── server.js                       # Updated to include summary routes

frontend/
└── src/
    └── pages/
        ├── DashboardPage.js        # Updated with summary display
        └── DashboardPage.css       # Updated with summary styles
```

## How It Works

### Backend Process:
1. Fetch up to 50 most recent articles for the company
2. Extract key information (title, description, sentiment, ESG category)
3. Send structured prompt to Gemini API
4. Parse AI response into structured JSON
5. Fallback to basic analysis if AI fails

### Frontend Process:
1. Fetch summary data after loading dashboard analytics
2. Display loading spinner while generating
3. Render summary in structured, visually appealing sections
4. Color-code elements by category and sentiment

## AI Prompt Strategy

The service uses a carefully crafted prompt that:
- Provides context about ESG categories
- Includes article data with metadata
- Requests specific JSON structure
- Emphasizes conciseness and actionability
- Focuses on significant issues only

## Usage

### Prerequisites
- Gemini API key configured in `.env`
- Articles must have sentiment and ESG categorization completed
- At least one article for the company in the database

### Testing
1. Search for a company (e.g., "Tesla")
2. Analyze articles (sentiment + ESG categorization)
3. Navigate to Dashboard
4. View the AI-generated summary at the top of the page

### Example Companies
- Tesla
- Amazon
- Microsoft
- BP
- Unilever

## Error Handling

1. **No Articles**: Returns 404 with appropriate message
2. **AI Failure**: Falls back to basic statistical summary
3. **Parsing Error**: Returns basic summary based on article metadata
4. **Network Error**: Displayed gracefully in frontend

## Performance Considerations

- Summary generation runs separately from other dashboard data
- Non-blocking UI - other charts load independently
- Caches articles to avoid repeated database queries
- Limits analysis to 50 most recent articles

## Future Enhancements

1. **Caching**: Cache generated summaries with TTL
2. **Comparison**: Compare summaries across time periods
3. **Export**: Allow exporting summaries as PDF
4. **Alerts**: Notify when significant changes in ESG standing
5. **Historical**: Track how summaries change over time

## Styling

The summary section uses:
- Clean card-based layout
- Color-coded ESG categories (Green/Blue/Purple)
- Sentiment indicators (Green/Red/Gray)
- Importance levels (High/Medium/Low)
- Responsive design for mobile devices

## API Integration

Uses the same Gemini API configuration as ESG categorization:
- Model: Set in `GEMINI_MODEL` environment variable
- Default: `gemini-2.5-flash-lite`
- Shared initialization with other AI services
