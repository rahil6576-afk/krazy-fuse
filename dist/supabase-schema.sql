
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
-- 3. MULTIPLAYER MATCHES TABLE (Match Results & Leaderboard Sync)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.multiplayer_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL,
    room_code TEXT,
    game_mode TEXT NOT NULL DEFAULT 'multiplayer',
    player1_name TEXT NOT NULL DEFAULT 'Player 1',
    player2_name TEXT NOT NULL DEFAULT 'Player 2',
    winner_name TEXT,
    score_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for retrieving match history per game
CREATE INDEX IF NOT EXISTS idx_mp_matches_game_id ON public.multiplayer_matches (game_id, created_at DESC);

-- Enable RLS and public read/insert
ALTER TABLE public.multiplayer_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read multiplayer_matches" 
ON public.multiplayer_matches FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert multiplayer_matches" 
ON public.multiplayer_matches FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- ==============================================================================
-- 4. GAME LEADERBOARDS TABLE (Global High Scores)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.game_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id TEXT NOT NULL,
    player_name TEXT NOT NULL DEFAULT 'Guest Gamer',
    player_avatar TEXT NOT NULL DEFAULT '👾',
    user_identifier TEXT,
    score NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Speedy index for top scores per game
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_rank 
ON public.game_leaderboards (game_id, score DESC, created_at ASC);

-- Enable RLS and public read/insert
ALTER TABLE public.game_leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read game_leaderboards" 
ON public.game_leaderboards FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert game_leaderboards" 
ON public.game_leaderboards FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- ==============================================================================
-- 5. REALTIME PUBLICATION ENABLEMENT
-- ==============================================================================
-- Enable Realtime broadcast for tables so clients get instantaneous updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_pitches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_leaderboards;

-- Set replica identity to FULL so realtime events contain complete row data
ALTER TABLE public.game_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.game_pitches REPLICA IDENTITY FULL;
ALTER TABLE public.multiplayer_matches REPLICA IDENTITY FULL;
ALTER TABLE public.game_leaderboards REPLICA IDENTITY FULL;
