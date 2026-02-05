# 📊 Dashboard Quick Start Guide

## 🎯 What You Get

A beautiful analytics dashboard with:
- 📈 **Sentiment Trends** - Line chart showing positive/negative/neutral trends over time
- 🥧 **ESG Distribution** - Pie chart showing Environmental/Social/Governance breakdown
- 📊 **ESG Bar Chart** - Bar chart comparing category counts
- 📅 **Timeline View** - Chronological list of ESG events

---

## 🚀 How to Access

### Method 1: From Home Page
```
1. Open http://localhost:3000
2. Click "📊 View Demo Dashboard" button
3. See dashboard for Tesla (demo)
```

### Method 2: From News Page
```
1. Search for any company (e.g., "Amazon")
2. Click "📊 View Dashboard" button on News page
3. See dashboard for your selected company
```

---

## 📸 What You'll See

### Top Section: Overview Cards
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  📰 Total    │  ✅ Positive │  ❌ Negative │  ➖ Neutral  │
│     50       │      25      │      15      │      10      │
│  Articles    │   Articles   │   Articles   │   Articles   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Middle Section: Charts
```
┌─────────────────────────────────────────────────────────┐
│  📈 Sentiment Trends Over Time                          │
│  [Line chart with 3 lines: Positive, Negative, Neutral]│
└─────────────────────────────────────────────────────────┘

┌──────────────────────────┐ ┌──────────────────────────┐
│  🏷️ ESG Distribution     │ │  📊 ESG Articles Count   │
│  [Pie chart with %]      │ │  [Bar chart with counts] │
└──────────────────────────┘ └──────────────────────────┘
```

### Bottom Section: Timeline
```
┌─────────────────────────────────────────────────────────┐
│  📅 Timeline of ESG Events                              │
│                                                         │
│  ● Jan 15, 2024  Tesla Announces Battery Tech          │
│    ✅ Positive  🌍 Environmental  • Reuters            │
│                                                         │
│  ● Jan 14, 2024  Tesla Faces Labor Lawsuit             │
│    ❌ Negative  👥 Social  • Bloomberg                 │
│                                                         │
│  ● Jan 13, 2024  Board Approves Compensation           │
│    ➖ Neutral  ⚖️ Governance  • CNBC                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Usage Tips

### Tip 1: Analyze First!
**Before viewing dashboard:**
1. Search for company
2. Click "🚀 Analyze" button
3. Wait for analysis to complete
4. Then view dashboard

**Why?** Dashboard shows analyzed data. Without analysis, charts will be empty.

### Tip 2: Navigate Easily
```
Dashboard Page:
├─ [← Back to Search] → Go to Home Page
└─ [View News →] → Go to News Page for current company
```

### Tip 3: Hover for Details
- **Charts:** Hover over data points to see exact values
- **Timeline:** Hover over events for highlight effect

### Tip 4: Responsive Design
- **Desktop:** Full 3-column layout
- **Tablet:** 2-column stacked layout
- **Mobile:** Single column, optimized for scrolling

---

## 🎨 Color Guide

### Sentiment Colors
```
✅ Positive  → Green (#10b981)
❌ Negative  → Red (#ef4444)
➖ Neutral   → Gray (#6b7280)
```

### ESG Colors
```
🌍 Environmental → Green (#10b981)
👥 Social        → Blue (#3b82f6)
⚖️ Governance    → Purple (#8b5cf6)
```

---

## 📋 Complete Workflow

### Full End-to-End Example

**Step 1: Search**
```
Home Page:
├─ Enter "Tesla"
├─ Select "Fetch New Articles"
└─ Click "Search"
Result: Redirected to News Page with 10 articles
```

**Step 2: Analyze**
```
News Page:
├─ Click "🚀 Analyze" button
├─ Wait ~20-30 seconds
└─ See success message
Result: Articles now have sentiment + ESG badges
```

**Step 3: Dashboard**
```
News Page:
├─ Click "📊 View Dashboard"
└─ Redirected to Dashboard Page
Result: See all visualizations!
```

**Step 4: Explore**
```
Dashboard:
├─ Scroll through sentiment trends
├─ View ESG distribution
├─ Browse timeline of events
└─ Check overview stats
```

---

## 🔍 What Each Chart Shows

### 📈 Sentiment Trends (Line Chart)
**Purpose:** See how sentiment changes over time

**Example Insight:**
```
"Tesla had mostly positive news from Jan 1-5, 
but negative sentiment increased after Jan 10 
due to the lawsuit announcement."
```

**How to Read:**
- X-axis: Dates
- Y-axis: Number of articles
- Green line: Positive articles per day
- Red line: Negative articles per day
- Gray line: Neutral articles per day

### 🥧 ESG Distribution (Pie Chart)
**Purpose:** See which ESG category dominates

**Example Insight:**
```
"60% of Tesla's news is Environmental (climate/energy),
25% is Social (labor/community),
15% is Governance (board/ethics)"
```

**How to Read:**
- Larger slice = More articles in that category
- Percentages shown on chart
- Colors match ESG categories

### 📊 ESG Bar Chart
**Purpose:** Compare absolute counts

**Example Insight:**
```
"Tesla has 30 Environmental articles, 
15 Social articles, and 10 Governance articles"
```

**How to Read:**
- Higher bar = More articles
- Each bar is one ESG category
- Hover to see exact count

### 📅 Timeline
**Purpose:** See chronological events

**Example Insight:**
```
"Recent positive news about battery tech, 
followed by negative lawsuit news, 
then neutral governance update"
```

**How to Read:**
- Top = Most recent
- Bottom = Older events
- Badges show sentiment + ESG category
- Source attribution on right

---

## ⚠️ Common Issues

### Issue 1: Empty Charts
**Problem:** Charts show "No data available"

**Solutions:**
1. Go to News Page
2. Click "🚀 Analyze" button
3. Wait for analysis to complete
4. Return to Dashboard

### Issue 2: Dashboard Redirects to Home
**Problem:** Dashboard immediately goes to Home Page

**Solution:**
- Must access dashboard FROM News Page or click demo button
- Cannot directly bookmark /dashboard without company state

### Issue 3: Loading Forever
**Problem:** Dashboard shows loading spinner indefinitely

**Solutions:**
1. Check if backend is running (port 5000)
2. Check if MongoDB is running
3. Check browser console for errors
4. Try refreshing the page

---

## 🎯 Best Practices

### For Best Results:

1. **Analyze 10+ Articles**
   - More data = Better trends
   - Need multiple dates for line chart

2. **Mix of Sentiments**
   - Having all positive/negative isn't useful
   - Diverse sentiments show trends better

3. **Categorize Everything**
   - ESG charts need categorized articles
   - Click analyze to do both at once

4. **Recent Data**
   - Fetch new articles regularly
   - Timeline shows most recent events

---

## 📱 Mobile Experience

### Mobile Layout:
```
┌─────────────────┐
│ [← Back]        │
│                 │
│ 📊 Dashboard    │
│                 │
├─────────────────┤
│ [📰 50] [✅ 25] │
│ [❌ 15] [➖ 10] │
├─────────────────┤
│ 📈 Trends       │
│ [Full width]    │
├─────────────────┤
│ 🏷️ Distribution │
│ [Full width]    │
├─────────────────┤
│ 📊 Bar Chart    │
│ [Full width]    │
├─────────────────┤
│ 📅 Timeline     │
│ • Event 1       │
│ • Event 2       │
│ • Event 3       │
└─────────────────┘
```

---

## 🎓 Understanding the Data

### Sentiment Analysis
**How it works:**
- BERT AI model analyzes article title + description
- Classifies as Positive, Negative, or Neutral
- Results shown in charts and timeline

### ESG Categorization
**How it works:**
- Gemini AI reads article content
- Categorizes into Environmental, Social, or Governance
- Articles can have multiple categories

### Timeline Events
**What's shown:**
- Most recent 20 events
- Each event shows: date, title, sentiment, ESG, source
- Chronological order (newest first)

---

## 🚀 Quick Commands

### From Home Page:
```
→ View Demo Dashboard: Click demo button
→ Search New Company: Enter name + search
```

### From News Page:
```
→ Analyze: Click 🚀 Analyze button
→ View Dashboard: Click 📊 View Dashboard
→ Back to Search: Click ← button
```

### From Dashboard:
```
→ View News: Click "View News →" button
→ Back to Search: Click "← Back to Search"
→ Scroll: Explore all charts and timeline
```

---

## ✨ Features Summary

| Feature | What It Shows | Why It Matters |
|---------|---------------|----------------|
| **Overview Cards** | Quick stats | At-a-glance metrics |
| **Sentiment Trends** | Changes over time | Identify patterns |
| **Pie Chart** | Category % | See focus areas |
| **Bar Chart** | Category counts | Compare volumes |
| **Timeline** | Event history | Understand context |

---

## 🎉 You're Ready!

**Open http://localhost:3000 and try it out!**

1. Click "📊 View Demo Dashboard"
2. Explore the visualizations
3. Click "View News →" to see articles
4. Click "🚀 Analyze" to update data
5. Return to dashboard to see changes

**Have fun exploring ESG insights!** 📊✨
