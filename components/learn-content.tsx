"use client"

import { useState } from "react"
import { Search, BookOpen, Code, Lightbulb, TrendingUp, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the learning categories
const categories = [
  {
    id: "basics",
    title: "Trading Basics",
    icon: <BookOpen className="h-5 w-5 text-[#00ff4c]" />,
    description: "Learn the fundamentals of trading and market analysis",
    articles: [
      { id: "intro", title: "Introduction to Trading", duration: "5 min read" },
      { id: "markets", title: "Understanding Markets", duration: "8 min read" },
      { id: "orders", title: "Order Types Explained", duration: "6 min read" },
      { id: "risk", title: "Risk Management Basics", duration: "7 min read" },
    ],
  },
  {
    id: "strategies",
    title: "Trading Strategies",
    icon: <TrendingUp className="h-5 w-5 text-[#00ff4c]" />,
    description: "Discover effective trading strategies for different market conditions",
    articles: [
      { id: "momentum", title: "Momentum Trading", duration: "10 min read" },
      { id: "swing", title: "Swing Trading Techniques", duration: "12 min read" },
      { id: "breakout", title: "Breakout Strategy", duration: "9 min read" },
      { id: "reversal", title: "Reversal Patterns", duration: "11 min read" },
    ],
  },
  {
    id: "technical",
    title: "Technical Analysis",
    icon: <Code className="h-5 w-5 text-[#00ff4c]" />,
    description: "Master technical indicators and chart patterns",
    articles: [
      { id: "indicators", title: "Key Technical Indicators", duration: "15 min read" },
      { id: "patterns", title: "Chart Patterns Guide", duration: "14 min read" },
      { id: "support", title: "Support & Resistance", duration: "8 min read" },
      { id: "fibonacci", title: "Fibonacci Retracement", duration: "13 min read" },
    ],
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    icon: <Lightbulb className="h-5 w-5 text-[#00ff4c]" />,
    description: "Develop the right mindset for successful trading",
    articles: [
      { id: "emotions", title: "Managing Emotions", duration: "7 min read" },
      { id: "discipline", title: "Trading Discipline", duration: "9 min read" },
      { id: "biases", title: "Cognitive Biases in Trading", duration: "11 min read" },
      { id: "journal", title: "Keeping a Trading Journal", duration: "6 min read" },
    ],
  },
]

export default function LearnContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto p-4 md:p-6 relative">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search learning resources..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-black border border-[#00ff4c33] text-white focus:outline-none focus:border-[#00ff4c] focus:ring-1 focus:ring-[#00ff4c]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00ff4c] h-5 w-5" />
        </div>
      </div>

      {/* Featured course */}
      <div className="mb-8 rounded-xl border border-[#00ff4c33] bg-black/60 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff4c10] to-transparent pointer-events-none"></div>
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start gap-4 sm:gap-6">
          <div className="w-full md:w-2/3">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Master the Markets: Complete Trading Course
            </h2>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Learn everything from basic concepts to advanced trading strategies in this comprehensive course.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#00ff4c20] text-[#00ff4c] text-xs font-medium">
                20+ Lessons
              </span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#00ff4c20] text-[#00ff4c] text-xs font-medium">
                5 Hours
              </span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#00ff4c20] text-[#00ff4c] text-xs font-medium">
                Beginner to Advanced
              </span>
            </div>
            <Button className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative">
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
              <span className="relative z-10">Start Learning</span>
            </Button>
          </div>
          <div className="w-full md:w-1/3 h-32 sm:h-40 rounded-lg bg-[#00ff4c10] flex items-center justify-center">
            <BookOpen className="h-12 sm:h-16 w-12 sm:w-16 text-[#00ff4c] opacity-50" />
          </div>
        </div>
      </div>

      {/* Learning categories */}
      <h3 className="text-xl font-bold text-white mb-4">Learning Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-[#00ff4c33] bg-black/60 backdrop-blur-sm overflow-hidden hover:border-[#00ff4c] transition-colors duration-200 cursor-pointer"
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <h4 className="text-lg font-semibold text-white">{category.title}</h4>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-[#00ff4c] transition-transform duration-200 ${
                    selectedCategory === category.id ? "rotate-90" : ""
                  }`}
                />
              </div>
              <p className="text-gray-300 text-sm mb-2">{category.description}</p>

              {/* Articles list - shown when category is selected */}
              {selectedCategory === category.id && (
                <div className="mt-4 space-y-2 border-t border-[#00ff4c33] pt-3">
                  {category.articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#00ff4c15] transition-colors duration-200"
                    >
                      <span className="text-white text-sm sm:text-base truncate mr-2">{article.title}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{article.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent articles */}
      <h3 className="text-xl font-bold text-white mb-4">Recent Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#00ff4c33] bg-black/60 backdrop-blur-sm overflow-hidden hover:border-[#00ff4c] transition-colors duration-200 cursor-pointer"
          >
            <div className="h-32 sm:h-40 bg-[#00ff4c10] flex items-center justify-center">
              <Lightbulb className="h-10 w-10 text-[#00ff4c] opacity-50" />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {i === 1
                  ? "Market Psychology: Understanding Fear and Greed"
                  : i === 2
                    ? "Top 5 Technical Indicators for Day Trading"
                    : "Risk Management: Protecting Your Capital"}
              </h4>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                {i === 1
                  ? "Learn how emotions drive market movements and how to use this to your advantage."
                  : i === 2
                    ? "Discover the most effective indicators for intraday trading decisions."
                    : "Essential strategies to preserve your trading capital in volatile markets."}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {i === 1 ? "8 min read" : i === 2 ? "12 min read" : "10 min read"}
                </span>
                <Button variant="ghost" className="text-[#00ff4c] hover:bg-[#00ff4c15] p-0 h-8 w-8">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
