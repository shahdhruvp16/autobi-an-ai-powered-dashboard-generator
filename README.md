<div align="center">
  <img src="/public/banner.png" width="100%" alt="AutoBI Banner"/>
</div>

# 🚀 AutoBI – AI-Powered Data-to-Dashboard Generator

**AutoBI** is an intelligent, end-to-end system that transforms your **CSV data** into a **beautiful analytical dashboard** using **AI, Power BI, and Tableau**.  
It automatically detects data patterns, suggests optimal visualizations, and generates insightful summaries and presentation-ready reports.

---

## 🧠 Overview

> Upload your dataset → Select a dashboard template → Let AI build your insights.

AutoBI automates the entire **data-to-decision** pipeline:
- Reads and understands any CSV dataset.
- Recommends the most effective charts and visual types.
- Auto-generates **Power BI** and **Tableau** dashboards.
- Produces executive summaries, insights, and presentation slides.
- Allows users to choose dashboard **themes/templates** for personalization.

---

## 🎯 Key Features

### 🧩 Smart Data Understanding
- Auto-detects numerical, categorical, and time-series columns.
- Uses AI to recognize the context of each field (e.g., “Profit”, “Region”, “Date”).
- Finds correlations, outliers, and hidden trends.

### 📊 Auto Visualization & Dashboard Generation
- Creates **Power BI** and **Tableau** dashboards using their APIs.
- Suggests the best charts:
  - Bar, Line, Map, Scatter, Treemap, Waterfall, etc.
- Auto-selects color themes and layouts.

### 🎨 Template Selection
- Choose from professional dashboard themes:
  - 💼 Business & Finance  
  - 📈 Sales & Marketing  
  - 👥 HR & Workforce  
  - 🏭 Operations & Manufacturing  
  - 🎓 Research & Academic

### 🧾 AI Insight & Summary Generator
- Converts analytics into human-readable reports:
  > “Revenue grew by 12% this quarter, driven by strong regional performance in the North Zone.”
- Creates PDF, PPTX, or Word reports automatically.

### ⚙️ One-Click Dashboard Export
- Download interactive dashboards for:
  - Power BI (.pbix)
  - Tableau (.twb / .twbx)
- Preview dashboards directly in the app.

### 💬 Interactive AI Chat Assistant
- Ask natural questions like:
  > “Which region contributed the highest revenue in Q4?”  
  > “Generate insights about customer churn trends.”

---

## 🧩 Supported Chart Types

AutoBI intelligently picks from the most effective chart types used in enterprise analytics:

| Category | Chart Examples | Used For |
|-----------|----------------|-----------|
| Comparative | Bar, Column, Stacked | Category comparisons |
| Trend | Line, Area, Dual-Axis | Time-series analysis |
| Distribution | Histogram, Box, Violin | Spread & outliers |
| Geographic | Map, Heatmap | Regional analytics |
| Relationship | Scatter, Bubble, Sankey | Correlations |
| Composition | Pie, Donut, Treemap | Part-to-whole |
| KPI | Gauge, Bullet, Cards | Performance metrics |
| Advanced | Waterfall, Correlation | Financial insights |

---

## 🧠 System Architecture

```
          ┌───────────────────────┐
          │   User Upload (CSV)   │
          └──────────┬────────────┘
                     │
           ┌─────────▼──────────┐
           │  Data Profiler AI  │  ← (Pandas, ydata-profiling)
           └─────────┬──────────┘
                     │
           ┌─────────▼──────────┐
           │ Insight Generator  │  ← (LLM, GPT-based summary)
           └─────────┬──────────┘
                     │
           ┌─────────▼──────────┐
           │ Chart Recommender  │  ← (AutoML-based selection)
           └─────────┬──────────┘
                     │
      ┌──────────────▼──────────────┐
      │ Power BI / Tableau Generator│
      └──────────────┬──────────────┘
                     │
           ┌─────────▼──────────┐
           │ Dashboard Renderer │  ← (React + Plotly Preview)
           └────────────────────┘
```

---

## 🧰 Tech Stack

| Layer | Tools / Technologies |
|-------|----------------------|
| **Frontend** | React.js + Tailwind CSS |
| **Backend** | Python (FastAPI / Flask) |
| **AI Layer** | GPT-based LLM + AutoML |
| **Visualization APIs** | Power BI REST API, Tableau API, Plotly |
| **Data Processing** | Pandas, NumPy, ydata-profiling |
| **Database** | PostgreSQL / MongoDB |
| **Reports Export** | python-pptx, reportlab, pandas-profiling |
| **Deployment** | Vercel (Frontend), Azure / AWS (Backend) |
| **Auth** | OAuth (Microsoft / Google) |

---

## 🧭 Workflow

1. **User uploads** a CSV file.  
2. **AI engine** performs data profiling and type detection.  
3. **Insight Generator** creates summaries and key findings.  
4. **Chart Recommender** selects visualizations based on data type.  
5. **User selects a template** (theme/style).  
6. System generates **Power BI/Tableau dashboard** via API.  
7. **AI summary & pitch deck** are created and exported.

---

## 🖼️ Dashboard Templates (Preview)

| Template | Description |
|-----------|--------------|
| 💼 Business Dashboard | KPIs, revenue trends, profit ratios |
| 📈 Sales Dashboard | Lead funnel, regional sales, conversion |
| 👥 HR Dashboard | Attrition, engagement, demographics |
| 🏭 Operations Dashboard | Efficiency, downtime, throughput |
| 🎓 Academic Dashboard | Research output, citations, grants |

*(Add screenshots here once templates are ready)*

---

## 📦 Installation

### Prerequisites
- Node.js ≥ 18  
- Python ≥ 3.10  
- Power BI / Tableau Developer Account (for API integration)

### Clone the repository
```bash
git clone https://github.com/<your-username>/AutoBI.git
cd AutoBI
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Then visit **http://localhost:3000**

---

## 🧠 AI Model Logic (Simplified Pseudocode)

```python
def process_csv(file):
    df = pd.read_csv(file)
    profile = ydata_profiling.ProfileReport(df)
    insights = LLM.generate_summary(df.describe())
    chart_suggestions = auto_visualize(df)
    dashboard = create_dashboard(chart_suggestions, insights)
    return dashboard
```

---

## 📊 Future Enhancements

- 🔮 **Voice-based insights narration**
- 📁 **Multi-file correlation & merging**
- 🤖 **AI chatbot for data Q&A**
- ☁️ **Google Sheets & Excel Live Data**
- 🪄 **Automated PowerPoint pitch deck generation**
- 🔗 **Dashboard sharing with live refresh**

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to enhance AutoBI, follow these steps:
1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Submit a pull request

---

## 📜 License
This project is licensed under the **MIT License** – free for personal and commercial use.

---

## 👨‍💻 Developed By

**Shah Dhruv**  
🎓 B.Tech Computer Science | ITM (SLS) Baroda University  
💡 AI/ML Developer • Web Developer • Research Enthusiast  

🌐 [Portfolio](https://dhruv-shah-portfolio.vercel.app)  
🔗 [LinkedIn](https://www.linkedin.com/in/dhruv-shah-27111b28a)  
🐙 [GitHub](https://github.com/shahdhruvp16)  

---

<div align="center">
  <h3>✨ Transform Your Data into Intelligent Insights with AutoBI ✨</h3>
</div>
