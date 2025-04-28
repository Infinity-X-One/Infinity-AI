import type { Workflow } from "./workflow"

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  workflow: Workflow
  icon: string
}

// Define common workflow templates
export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "data-analysis",
    name: "Data Analysis Pipeline",
    description: "Analyze data and generate insights automatically",
    category: "Analysis",
    icon: "LineChart",
    workflow: {
      id: "data-analysis-workflow",
      name: "Data Analysis Pipeline",
      steps: [
        {
          id: "step-1",
          type: "bot",
          name: "Data Collection",
          icon: "Database",
          botId: "analyze-bot",
          config: {
            action: "collect",
            source: "api",
          },
        },
        {
          id: "step-2",
          type: "bot",
          name: "Data Processing",
          icon: "Filter",
          botId: "analyze-bot",
          config: {
            action: "process",
            filters: ["outliers", "missing-values"],
          },
        },
        {
          id: "step-3",
          type: "bot",
          name: "Insight Generation",
          icon: "Lightbulb",
          botId: "analyze-bot",
          config: {
            action: "analyze",
            outputFormat: "report",
          },
        },
      ],
    },
  },
  {
    id: "market-monitoring",
    name: "Market Monitoring",
    description: "Monitor market trends and send alerts",
    category: "Finance",
    icon: "TrendingUp",
    workflow: {
      id: "market-monitoring-workflow",
      name: "Market Monitoring",
      steps: [
        {
          id: "step-1",
          type: "bot",
          name: "Market Data Collection",
          icon: "BarChart2",
          botId: "predictions-bot",
          config: {
            markets: ["stocks", "crypto", "forex"],
            interval: "15m",
          },
        },
        {
          id: "step-2",
          type: "bot",
          name: "Trend Analysis",
          icon: "TrendingUp",
          botId: "analyze-bot",
          config: {
            indicators: ["moving-average", "rsi", "macd"],
          },
        },
        {
          id: "step-3",
          type: "action",
          name: "Alert Generation",
          icon: "Bell",
          actionId: "send-alert",
          config: {
            channels: ["email", "notification"],
            threshold: "significant",
          },
        },
      ],
    },
  },
  {
    id: "content-curation",
    name: "Content Curation",
    description: "Discover and curate relevant content",
    category: "Content",
    icon: "FileText",
    workflow: {
      id: "content-curation-workflow",
      name: "Content Curation",
      steps: [
        {
          id: "step-1",
          type: "bot",
          name: "Content Discovery",
          icon: "Search",
          botId: "connections-bot",
          config: {
            sources: ["rss", "api", "web"],
            keywords: ["finance", "technology", "ai"],
          },
        },
        {
          id: "step-2",
          type: "bot",
          name: "Content Filtering",
          icon: "Filter",
          botId: "picky-bot",
          config: {
            criteria: ["relevance", "quality", "recency"],
          },
        },
        {
          id: "step-3",
          type: "bot",
          name: "Summary Generation",
          icon: "FileText",
          botId: "analyze-bot",
          config: {
            format: "bullet-points",
            length: "medium",
          },
        },
        {
          id: "step-4",
          type: "action",
          name: "Content Publishing",
          icon: "Share2",
          actionId: "publish",
          config: {
            platforms: ["email", "dashboard"],
          },
        },
      ],
    },
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Analyze sentiment across various sources",
    category: "Analysis",
    icon: "Activity",
    workflow: {
      id: "sentiment-analysis-workflow",
      name: "Sentiment Analysis",
      steps: [
        {
          id: "step-1",
          type: "bot",
          name: "Data Collection",
          icon: "Globe",
          botId: "connections-bot",
          config: {
            sources: ["social-media", "news", "forums"],
            keywords: ["brand", "product", "industry"],
          },
        },
        {
          id: "step-2",
          type: "bot",
          name: "Sentiment Analysis",
          icon: "BarChart",
          botId: "analyze-bot",
          config: {
            metrics: ["positive", "negative", "neutral"],
            depth: "detailed",
          },
        },
        {
          id: "step-3",
          type: "bot",
          name: "Trend Identification",
          icon: "TrendingUp",
          botId: "predictions-bot",
          config: {
            timeframe: "weekly",
            comparison: "previous-period",
          },
        },
        {
          id: "step-4",
          type: "action",
          name: "Report Generation",
          icon: "FileText",
          actionId: "generate-report",
          config: {
            format: "pdf",
            sections: ["summary", "details", "recommendations"],
          },
        },
      ],
    },
  },
  {
    id: "health-monitoring",
    name: "Health Monitoring",
    description: "Monitor health metrics and provide insights",
    category: "Health",
    icon: "Heart",
    workflow: {
      id: "health-monitoring-workflow",
      name: "Health Monitoring",
      steps: [
        {
          id: "step-1",
          type: "bot",
          name: "Data Collection",
          icon: "Activity",
          botId: "health-bot",
          config: {
            metrics: ["heart-rate", "sleep", "activity"],
            source: "wearable",
          },
        },
        {
          id: "step-2",
          type: "bot",
          name: "Data Analysis",
          icon: "BarChart",
          botId: "analyze-bot",
          config: {
            timeframe: "daily",
            comparison: "baseline",
          },
        },
        {
          id: "step-3",
          type: "bot",
          name: "Recommendation Generation",
          icon: "MessageCircle",
          botId: "health-bot",
          config: {
            focus: ["sleep-quality", "activity-level", "stress-management"],
            personalization: "high",
          },
        },
        {
          id: "step-4",
          type: "action",
          name: "Weekly Report",
          icon: "FileText",
          actionId: "generate-report",
          config: {
            schedule: "weekly",
            format: "email",
          },
        },
      ],
    },
  },
]
