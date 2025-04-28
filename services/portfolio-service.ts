import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PortfolioDataPoint {
  date: string
  value: number
  prediction?: number
}

export interface PortfolioPerformance {
  id: string
  name: string
  currentValue: number
  percentageGain: number
  accuracy: number
  data: PortfolioDataPoint[]
}

export interface PredictionRecord {
  id: string
  timestamp: string
  asset: string
  symbol: string
  confidence: number
  buyPrice: number
  predictedPrice: number
  holdTime: string
  sellPrice: number | null
  profit: number | null
  accuracy: number | null
  status: "active" | "completed" | "failed"
}

export async function fetchPortfolioData(timeRange: string): Promise<PortfolioPerformance[]> {
  try {
    // Check if tables exist
    const { data: tableCheck, error: tableError } = await supabase.from("market_data").select("id").limit(1)

    if (tableError && tableError.message.includes("does not exist")) {
      console.log("Tables do not exist yet. Using empty data.")
      return []
    }

    // This would be replaced with actual data fetching from Supabase
    // For now, we're just returning empty data
    return []
  } catch (error) {
    console.error("Error fetching portfolio data:", error)
    return []
  }
}

export async function fetchPredictions(): Promise<PredictionRecord[]> {
  try {
    // Check if tables exist
    const { data: tableCheck, error: tableError } = await supabase.from("predictions").select("id").limit(1)

    if (tableError && tableError.message.includes("does not exist")) {
      console.log("Predictions table does not exist yet. Using empty data.")
      return []
    }

    // This would be replaced with actual data fetching from Supabase
    // For now, we're just returning empty data
    return []
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return []
  }
}

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Create market_data table if it doesn't exist
    const { error: marketDataError } = await supabase.rpc("execute_sql", {
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

    if (marketDataError) {
      console.error("Error creating market_data table:", marketDataError)
      return false
    }

    // Create predictions table if it doesn't exist
    const { error: predictionsError } = await supabase.rpc("execute_sql", {
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

    if (predictionsError) {
      console.error("Error creating predictions table:", predictionsError)
      return false
    }

    // Create portfolio_performance table if it doesn't exist
    const { error: portfolioError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS portfolio_performance (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          portfolio_id VARCHAR NOT NULL,
          portfolio_name VARCHAR NOT NULL,
          initial_value DECIMAL(18, 4) NOT NULL,
          current_value DECIMAL(18, 4) NOT NULL,
          percentage_gain DECIMAL(8, 4),
          accuracy DECIMAL(5, 2),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(portfolio_id, timestamp)
        );
      `,
    })

    if (portfolioError) {
      console.error("Error creating portfolio_performance table:", portfolioError)
      return false
    }

    // Create portfolio_data_points table if it doesn't exist
    const { error: dataPointsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS portfolio_data_points (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          portfolio_id VARCHAR NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          value DECIMAL(18, 4) NOT NULL,
          prediction DECIMAL(18, 4),
          UNIQUE(portfolio_id, date)
        );
      `,
    })

    if (dataPointsError) {
      console.error("Error creating portfolio_data_points table:", dataPointsError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}
