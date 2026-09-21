-- ==============================================================================
-- KRAZY FUSE ARCADE — SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- ==============================================================================
-- Run this SQL in your Supabase Project: Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. GAME REACTIONS TABLE (Likes & Dislikes)
CREATE TABLE IF NOT EXISTS public.game_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL,
    user_identifier TEXT NOT NULL,
    reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_game_user UNIQUE (game_id, user_identifier)
);

-- Index for speedy aggregate counts per game
CREATE INDEX IF NOT EXISTS idx_game_reactions_game_id ON public.game_reactions (game_id);
CREATE INDEX IF NOT EXISTS idx_game_reactions_reaction ON public.game_reactions (game_id, reaction);

-- 2. GAME PITCHES TABLE (Community Game Ideas)
CREATE TABLE IF NOT EXISTS public.game_pitches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL DEFAULT 'Guest',
    avatar TEXT NOT NULL DEFAULT '👾',
    pitch_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'reviewing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fetching latest pitches quickly
CREATE INDEX IF NOT EXISTS idx_game_pitches_created_at ON public.game_pitches (created_at DESC);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on both tables
ALTER TABLE public.game_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_pitches ENABLE ROW LEVEL SECURITY;

-- Allow public read access to game_reactions
CREATE POLICY "Allow public read game_reactions" 
ON public.game_reactions FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public insert/upsert to game_reactions
CREATE POLICY "Allow public insert/update game_reactions" 
ON public.game_reactions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update game_reactions" 
ON public.game_reactions FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete game_reactions" 
ON public.game_reactions FOR DELETE 
TO anon, authenticated 
USING (true);

-- Allow public read access to game_pitches
CREATE POLICY "Allow public read game_pitches" 
ON public.game_pitches FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public insert access to game_pitches
CREATE POLICY "Allow public insert game_pitches" 
ON public.game_pitches FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- ==============================================================================
-- 4. REALTIME PUBLICATION ENABLEMENT
-- ==============================================================================
-- Enable Realtime broadcast for both tables so clients get instantaneous updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_pitches;

-- Set replica identity to FULL so realtime events contain complete row data
ALTER TABLE public.game_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.game_pitches REPLICA IDENTITY FULL;
