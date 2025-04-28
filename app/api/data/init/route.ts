import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This endpoint will initialize the database tables
export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "", // Using service role key for admin operations
    )

    // Create market_data table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS market_data (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          symbol VARCHAR NOT NULL,
          price DECIMAL(18, 4) NOT NULL,
          change DECIMAL(18, 4),
          change_percent DECIMAL(8, 4),
          volume BIGINT,
          market_cap BIGINT,
          high DECIMAL(18, 4),
          low DECIMAL(18, 4),
          open DECIMAL(18, 4),
          previous_close DECIMAL(18, 4),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(symbol, timestamp)
        );
      `,
    })

    // Create news table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS news (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          summary TEXT,
          url TEXT,
          source VARCHAR,
          published_at TIMESTAMP WITH TIME ZONE,
          sentiment DECIMAL(4, 2),
          relevance DECIMAL(4, 2),
          symbols TEXT[],
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create sentiment table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS sentiment (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          symbol VARCHAR NOT NULL,
          overall_sentiment DECIMAL(4, 2) NOT NULL,
          score DECIMAL(4, 2),
          social_media_sentiment DECIMAL(4, 2),
          news_sentiment DECIMAL(4, 2),
          analyst_sentiment DECIMAL(4, 2),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(symbol, timestamp)
        );
      `,
    })

    // Create predictions table
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS predictions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          symbol VARCHAR NOT NULL,
          predicted_price DECIMAL(18, 4),
          predicted_change DECIMAL(18, 4),
          predicted_change_percent DECIMAL(8, 4),
          confidence DECIMAL(4, 2),
          timeframe VARCHAR,
          supporting_factors JSONB,
          risk_factors JSONB,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(symbol, timeframe, timestamp)
        );
      `,
    })

    // Create indexes for performance
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);
        CREATE INDEX IF NOT EXISTS idx_market_data_timestamp ON market_data(timestamp);
        CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
        CREATE INDEX IF NOT EXISTS idx_sentiment_symbol ON sentiment(symbol);
        CREATE INDEX IF NOT EXISTS idx_predictions_symbol ON predictions(symbol);
        CREATE INDEX IF NOT EXISTS idx_predictions_timeframe ON predictions(timeframe);
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Database tables initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database tables:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize database tables", error: String(error) },
      { status: 500 },
    )
  }
}
