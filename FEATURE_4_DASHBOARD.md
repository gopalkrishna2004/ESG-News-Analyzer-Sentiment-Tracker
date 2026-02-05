# 📊 Feature 4: Trend Dashboard & Visualizations

## Overview
A comprehensive analytics dashboard that provides visual insights into ESG news data, sentiment trends, and category distributions for companies.

## Features Implemented

### 1. **Sentiment Trends Over Time** 📈
- **Chart Type:** Line Chart
- **Purpose:** Shows how sentiment (Positive/Negative/Neutral) changes over time
- **Data:** Aggregated daily sentiment counts
- **Interactivity:** Hover tooltips, legend toggles
- **Colors:**
  - Positive: Green (#10b981)
  - Negative: Red (#ef4444)
  - Neutral: Gray (#6b7280)

### 2. **ESG Category Distribution** 🏷️
- **Chart Types:** 
  - Pie Chart (percentage distribution)
  - Bar Chart (absolute counts)
- **Purpose:** Visualize the distribution of articles across ESG categories
- **Data:** Article counts per category (Environmental, Social, Governance)
- **Colors:**
  - Environmental: Green (#10b981)
  - Social: Blue (#3b82f6)
  - Governance: Purple (#8b5cf6)

### 3. **Timeline View of ESG Events** 📅
- **Format:** Vertical timeline with markers
- **Purpose:** Chronological view of ESG-related events
- **Features:**
  - Date and time stamps
  - Article titles
  - Sentiment badges
  - ESG category badges
  - Source attribution
- **Interactivity:** Hover effects, visual markers

### 4. **Overview Statistics** 📊
- **Cards Display:**
  - Total Articles count
  - Positive sentiment count
  - Negative sentiment count
  - Neutral sentiment count
- **Visual Design:** Color-coded cards with icons

---

## Tech Stack

### Backend
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose aggregation
- **API Endpoints:** 4 new analytics endpoints

### Frontend
- **Library:** React with Hooks
- **Charts:** Recharts (responsive, customizable)
- **Routing:** React Router
- **Styling:** Custom CSS with gradients and animations

---

## API Endpoints

### 1. GET `/api/analytics/overview/:companyName`
**Purpose:** Get summary statistics

**Response:**
```json
{
  "success": true,
  "company": "Tesla",
  "stats": {
    "totalArticles": 50,
    "sentimentBreakdown": {
      "Positive": 25,
      "Negative": 15,
      "Neutral": 10
    },
    "esgBreakdown": {
      "Environmental": 30,
      "Social": 15,
      "Governance": 20
    },
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### 2. GET `/api/analytics/sentiment-trends/:companyName`
**Purpose:** Get daily sentiment trends

**Response:**
```json
{
  "success": true,
  "company": "Tesla",
  "trends": [
    {
      "date": "2024-01-01",
      "Positive": 5,
      "Negative": 2,
      "Neutral": 1,
      "total": 8
    },
    {
      "date": "2024-01-02",
      "Positive": 3,
      "Negative": 4,
      "Neutral": 2,
      "total": 9
    }
  ]
}
```

### 3. GET `/api/analytics/esg-distribution/:companyName`
**Purpose:** Get ESG category distribution

**Response:**
```json
{
  "success": true,
  "company": "Tesla",
  "distribution": [
    { "name": "Environmental", "value": 30 },
    { "name": "Social", "value": 15 },
    { "name": "Governance", "value": 20 }
  ],
  "total": 65
}
```

### 4. GET `/api/analytics/timeline/:companyName?limit=20`
**Purpose:** Get chronological timeline of events

**Response:**
```json
{
  "success": true,
  "company": "Tesla",
  "timeline": [
    {
      "date": "2024-01-15T10:00:00Z",
      "title": "Tesla Announces New Battery Technology",
      "sentiment": "Positive",
      "esgCategory": ["Environmental"],
      "source": "Reuters"
    }
  ]
}
```

---

## User Flow

### Access Dashboard
```
Option 1: From Home Page
  ├─ Click "View Demo Dashboard" button
  └─ Redirects to /dashboard with default company (Tesla)

Option 2: From News Page
  ├─ After searching for a company
  ├─ Click "View Dashboard" button
  └─ Redirects to /dashboard with selected company

Direct URL
  └─ /dashboard (requires state.company)
```

### Navigation
```
Dashboard Page:
├─ [← Back to Search] button → Home Page
├─ [View News →] button → News Page for current company
└─ All visualizations update based on company data
```

---

## Visual Design

### Color Palette
```css
Primary Gradient: #667eea → #764ba2 (Purple gradient)
Success: #10b981 (Green)
Error: #ef4444 (Red)
Neutral: #6b7280 (Gray)
Info: #3b82f6 (Blue)
Accent: #8b5cf6 (Purple)
```

### Typography
```css
Headers: 2.2rem, bold, white with shadow
Subheaders: 1.3rem, semi-bold, dark gray
Body: 1rem, regular
Small text: 0.85rem, medium weight
```

### Layout
- **Max Width:** 1400px (wide dashboard)
- **Grid System:** CSS Grid with responsive columns
- **Cards:** White background, rounded corners, shadow
- **Spacing:** Consistent 1.5-2rem gaps

---

## Components Structure

### DashboardPage.js
```
DashboardPage
├─ Header
│  ├─ Back Button
│  ├─ Title & Subtitle
│  └─ View News Button
├─ Overview Cards (4 stat cards)
├─ Charts Container
│  ├─ Sentiment Trends (Line Chart)
│  ├─ ESG Distribution (Pie Chart)
│  └─ ESG Articles (Bar Chart)
└─ Timeline Section
   └─ Timeline Items (scrollable list)
```

---

## Data Aggregation Logic

### Sentiment Trends
```javascript
// Group articles by date
articles.forEach(article => {
  const date = new Date(article.publishedAt).toISOString().split('T')[0];
  
  if (!trendData[date]) {
    trendData[date] = { date, Positive: 0, Negative: 0, Neutral: 0 };
  }
  
  trendData[date][article.sentiment]++;
});
```

### ESG Distribution
```javascript
// MongoDB Aggregation Pipeline
db.newsarticles.aggregate([
  { $match: { company: "Tesla", esgCategory: { $exists: true } } },
  { $unwind: '$esgCategory' },
  { $group: { _id: '$esgCategory', count: { $sum: 1 } } }
])
```

---

## Responsive Design

### Desktop (> 1200px)
- 3-column chart grid
- Side-by-side pie and bar charts
- Full-width line chart

### Tablet (768px - 1200px)
- 2-column chart grid
- Stacked layouts
- Adjusted font sizes

### Mobile (< 768px)
- Single column layout
- Smaller stat cards (2-column grid)
- Compressed charts
- Simplified timeline

---

## Chart Customization

### Line Chart (Sentiment Trends)
```javascript
<LineChart data={sentimentTrends}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" tickFormatter={formatDate} />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line 
    type="monotone" 
    dataKey="Positive" 
    stroke="#10b981" 
    strokeWidth={3}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />
</LineChart>
```

### Pie Chart (ESG Distribution)
```javascript
<PieChart>
  <Pie
    data={esgDistribution}
    label={({ name, percent }) => 
      `${name} ${(percent * 100).toFixed(0)}%`
    }
    outerRadius={100}
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[entry.name]} />
    ))}
  </Pie>
</PieChart>
```

### Bar Chart (ESG Counts)
```javascript
<BarChart data={esgDistribution}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[entry.name]} />
    ))}
  </Bar>
</BarChart>
```

---

## Features Highlights

### ✅ Implemented
1. ✅ Sentiment trends line chart
2. ✅ ESG distribution pie chart
3. ✅ ESG distribution bar chart
4. ✅ Timeline view with events
5. ✅ Overview statistics cards
6. ✅ Responsive design
7. ✅ Smooth animations
8. ✅ Hover interactions
9. ✅ Color-coded categories
10. ✅ Date formatting
11. ✅ Navigation between pages
12. ✅ Loading states
13. ✅ Empty state handling
14. ✅ Real-time data fetching

---

## Performance Optimizations

### Data Fetching
- Parallel API calls using `Promise.all()`
- Efficient MongoDB aggregation pipelines
- Limited timeline to recent 20 events

### Rendering
- Recharts' built-in optimization
- ResponsiveContainer for adaptive sizing
- CSS animations using GPU acceleration

### Code Splitting
- Separate page components
- Lazy loading potential for charts

---

## Usage Example

### Step 1: Search for Company
```
Home Page → Enter "Tesla" → Search → View News
```

### Step 2: Analyze Articles
```
News Page → Click "Analyze" button → Wait for completion
```

### Step 3: View Dashboard
```
News Page → Click "View Dashboard" → See visualizations
```

### Step 4: Explore Data
```
Dashboard:
├─ View sentiment trends over time
├─ See ESG category breakdown
├─ Browse timeline of events
└─ Check overview statistics
```

---

## Empty States

### No Sentiment Data
```
Message: "No sentiment data available. Analyze articles first."
Action: Redirect to News page to analyze
```

### No ESG Data
```
Message: "No ESG data available. Categorize articles first."
Action: Redirect to News page to categorize
```

### No Timeline Data
```
Message: "No timeline data available."
Action: Fetch more articles from News page
```

---

## Browser Compatibility

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

---

## Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "recharts": "^2.10.0",
  "axios": "^1.6.2"
}
```

---

## Testing Checklist

### Backend
- [ ] GET /api/analytics/overview returns correct stats
- [ ] GET /api/analytics/sentiment-trends groups by date
- [ ] GET /api/analytics/esg-distribution calculates percentages
- [ ] GET /api/analytics/timeline sorts chronologically
- [ ] Error handling for invalid company names
- [ ] Edge cases: no data, empty results

### Frontend
- [ ] Dashboard loads for valid company
- [ ] Charts render with correct data
- [ ] Timeline displays events in order
- [ ] Navigation buttons work
- [ ] Responsive design works on mobile
- [ ] Loading states display properly
- [ ] Empty states show helpful messages
- [ ] Hover interactions work

---

## Future Enhancements

### Potential Features
1. **Export Charts** - Download as PNG/PDF
2. **Date Range Filter** - Select custom time periods
3. **Comparison View** - Compare multiple companies
4. **Real-time Updates** - WebSocket integration
5. **Advanced Filters** - Filter by source, sentiment, category
6. **Predictive Analytics** - AI-powered trend predictions
7. **Custom Dashboards** - User-configurable layouts
8. **Share Dashboard** - Generate shareable links

---

## Troubleshooting

### Charts Not Showing
**Problem:** Charts display "No data available"  
**Solution:** Ensure articles are analyzed and categorized first

### Layout Issues
**Problem:** Charts overlapping or misaligned  
**Solution:** Check browser zoom level, clear cache

### Slow Loading
**Problem:** Dashboard takes too long to load  
**Solution:** Reduce timeline limit, check database indexes

### Navigation Error
**Problem:** Dashboard redirects to home  
**Solution:** Ensure company state is passed via navigate()

---

## Summary

✅ **4 Interactive Charts** (Line, Pie, Bar, Timeline)  
✅ **4 API Endpoints** (Overview, Trends, Distribution, Timeline)  
✅ **Responsive Design** (Desktop, Tablet, Mobile)  
✅ **Beautiful UI** (Gradients, Animations, Shadows)  
✅ **Real Data** (MongoDB aggregations, live updates)  
✅ **Easy Navigation** (Between all 3 pages)  

**The dashboard provides comprehensive visual insights into ESG news data!** 📊✨
