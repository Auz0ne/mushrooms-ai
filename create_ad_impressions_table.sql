-- Create ad_impressions table for tracking ad performance
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  ad_id TEXT NOT NULL,
  impression_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ad_impressions_user_id ON ad_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_chat_id ON ad_impressions(chat_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_timestamp ON ad_impressions(timestamp);

-- Enable Row Level Security
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth requirements)
CREATE POLICY "Users can view their own ad impressions" ON ad_impressions
  FOR SELECT USING (true); -- Adjust based on your auth setup

CREATE POLICY "Users can insert their own ad impressions" ON ad_impressions
  FOR INSERT WITH CHECK (true); -- Adjust based on your auth setup

CREATE POLICY "Users can update their own ad impressions" ON ad_impressions
  FOR UPDATE USING (true); -- Adjust based on your auth setup 