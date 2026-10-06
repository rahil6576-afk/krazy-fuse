/**
 * Krazy Fuse Arcade — Supabase Realtime Client Service
 * Handles live synchronization for Likes, Dislikes, and Game Pitches with offline fallback.
 */

const KrazySupabase = (function() {
    const STORAGE_URL_KEY = 'kf_supabase_url';
    const STORAGE_ANON_KEY = 'kf_supabase_anon_key';
    const STORAGE_LOCAL_PITCHES_KEY = 'kf_local_saved_pitches';
    const STORAGE_LOCAL_REACTIONS_KEY = 'kf_local_reactions_counts';

    let client = null;
    let realtimeChannel = null;
    let isConnected = false;
    let reactionListeners = [];
    let pitchListeners = [];

    function getConfig() {
        const winConfig = window.KRAZY_SUPABASE_CONFIG || {};
        const url = (localStorage.getItem(STORAGE_URL_KEY) || winConfig.url || '').trim();
        const anonKey = (localStorage.getItem(STORAGE_ANON_KEY) || winConfig.anonKey || '').trim();
        return { url, anonKey };
    }

    function init() {
        const { url, anonKey } = getConfig();
        if (!url || !anonKey) {
            console.info('⚡ [KrazySupabase] Running in local offline mode. Provide Supabase URL & Anon Key to activate live cloud sync.');
            isConnected = false;
            updateConnectionUI();
            return false;
        }

        if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
            console.warn('⚠️ [KrazySupabase] Supabase JS SDK not loaded yet.');
            isConnected = false;
            updateConnectionUI();
            return false;
        }

        try {
            client = window.supabase.createClient(url, anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storage: window.localStorage
                },
                realtime: {
                    params: {
                        eventsPerSecond: 10
                    }
                }
            });
            isConnected = true;
            console.log('🟢 [KrazySupabase] Client initialized successfully with cloud backend.');
            updateConnectionUI();
            setupRealtimeSubscriptions();
            return true;
        } catch (err) {
            console.error('❌ [KrazySupabase] Initialization failed:', err);
            isConnected = false;
            updateConnectionUI();
            return false;
        }
    }

    function isConfigured() {
        return !!(client && isConnected);
    }

    function saveCredentials(url, anonKey) {
        if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
        if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
        return init();
    }

    function clearCredentials() {
        localStorage.removeItem(STORAGE_URL_KEY);
        localStorage.removeItem(STORAGE_ANON_KEY);
        if (realtimeChannel && client) {
            client.removeChannel(realtimeChannel);
        }
        client = null;
        isConnected = false;
        updateConnectionUI();
    }

    function updateConnectionUI() {
        const badge = document.getElementById('supabase-status-badge');
        if (!badge) return;

        if (isConnected) {
            badge.className = 'supabase-status-pill online';
            badge.innerHTML = '<span class="status-dot"></span><span>⚡ Live Supabase Connected</span>';
            badge.title = 'Real-time live monitoring active for likes & game pitches.';
        } else {
            badge.className = 'supabase-status-pill offline';
            badge.innerHTML = '<span class="status-dot"></span><span>⚡ Local Fallback (Click to Connect Supabase)</span>';
            badge.title = 'Click to connect your Supabase project URL & Anon key for live cloud monitoring.';
        }
    }

    // ==========================================
    // REALTIME SUBSCRIPTIONS
    // ==========================================
    function setupRealtimeSubscriptions() {
        if (!client) return;

        try {
            if (realtimeChannel) {
                client.removeChannel(realtimeChannel);
            }

            realtimeChannel = client.channel('krazy_fuse_live_sync')
                // Listen to reaction changes (likes / dislikes)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'game_reactions' },
                    (payload) => {
                        console.log('⚡ [Realtime] Reaction event received:', payload);
                        notifyReactionListeners(payload);
                        window.dispatchEvent(new CustomEvent('krazy:reaction_changed', { detail: payload }));
                    }
                )
                // Listen to new game pitch suggestions
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'game_pitches' },
                    (payload) => {
                        console.log('💡 [Realtime] New pitch received:', payload);
                        notifyPitchListeners(payload.new);
                        window.dispatchEvent(new CustomEvent('krazy:new_pitch', { detail: payload.new }));
                    }
                )
                // Listen to new high scores on global leaderboards
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'game_leaderboards' },
                    (payload) => {
                        console.log('🏆 [Realtime] New high score received:', payload);
                        notifyLeaderboardListeners(payload.new);
                        window.dispatchEvent(new CustomEvent('krazy:leaderboard_updated', { detail: payload.new }));
                    }
                )
                .subscribe((status) => {
                    console.log('📡 [KrazySupabase Realtime Status]:', status);
                });
        } catch (e) {
            console.warn('Realtime subscription setup warning:', e);
        }
    }

    function onReactionChange(callback) {
        if (typeof callback === 'function') reactionListeners.push(callback);
    }

    function onNewPitch(callback) {
        if (typeof callback === 'function') pitchListeners.push(callback);
    }

    function notifyReactionListeners(payload) {
        reactionListeners.forEach(cb => {
            try { cb(payload); } catch (e) { console.error(e); }
        });
    }

    function notifyPitchListeners(newPitch) {
        pitchListeners.forEach(cb => {
            try { cb(newPitch); } catch (e) { console.error(e); }
        });
    }

    // ==========================================
    // REACTIONS API (Likes & Dislikes)
    // ==========================================
    async function saveReaction(gameId, userIdentifier, reaction) {
        // reaction: 'like' | 'dislike' | null (to remove)
        if (!isConfigured()) {
            return saveLocalReaction(gameId, userIdentifier, reaction);
        }

        try {
            if (!reaction) {
                const { error } = await client
                    .from('game_reactions')
                    .delete()
                    .match({ game_id: gameId, user_identifier: userIdentifier });

                if (error) throw error;
                return { success: true, removed: true };
            }

            const { data, error } = await client
                .from('game_reactions')
                .upsert({
                    game_id: gameId,
                    user_identifier: userIdentifier,
                    reaction: reaction,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'game_id,user_identifier'
                })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (err) {
            console.error('❌ Error saving reaction to Supabase, saving locally:', err);
            return saveLocalReaction(gameId, userIdentifier, reaction);
        }
    }

    async function getGameReactionCounts(gameId) {
        if (!isConfigured()) {
            return getLocalReactionCounts(gameId);
        }

        try {
            const { count: likes, error: errLikes } = await client
                .from('game_reactions')
                .select('*', { count: 'exact', head: true })
                .eq('game_id', gameId)
                .eq('reaction', 'like');

            const { count: dislikes, error: errDislikes } = await client
                .from('game_reactions')
                .select('*', { count: 'exact', head: true })
                .eq('game_id', gameId)
                .eq('reaction', 'dislike');

            if (errLikes || errDislikes) {
                return getLocalReactionCounts(gameId);
            }

            return { likes: likes || 0, dislikes: dislikes || 0 };
        } catch (err) {
            return getLocalReactionCounts(gameId);
        }
    }

    async function getAllReactionCounts() {
        if (!isConfigured()) {
            return getLocalAllReactionCounts();
        }

        try {
            const { data, error } = await client
                .from('game_reactions')
                .select('game_id, reaction');

            if (error || !data) return getLocalAllReactionCounts();

            const map = {};
            data.forEach(row => {
                if (!map[row.game_id]) map[row.game_id] = { likes: 0, dislikes: 0 };
                if (row.reaction === 'like') map[row.game_id].likes++;
                if (row.reaction === 'dislike') map[row.game_id].dislikes++;
            });
            return map;
        } catch (e) {
            return getLocalAllReactionCounts();
        }
    }

    // Local Reaction Fallbacks
    function saveLocalReaction(gameId, userIdentifier, reaction) {
        try {
            const key = `kf_reaction_${userIdentifier}_${gameId}`;
            if (reaction) {
                localStorage.setItem(key, reaction);
            } else {
                localStorage.removeItem(key);
            }
            return { success: true, local: true };
        } catch (e) {
            return { success: false, error: e };
        }
    }

    function getLocalReactionCounts(gameId) {
        return { likes: 0, dislikes: 0 };
    }

    function getLocalAllReactionCounts() {
        return {};
    }

    // ==========================================
    // PITCHES API (Game Concept Submissions)
    // ==========================================
    async function submitPitch(username, avatar, pitchText) {
        const cleanText = (pitchText || '').trim();
        if (!cleanText) return { success: false, error: 'Empty pitch' };

        const payload = {
            id: 'pitch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            username: username || 'Guest Gamer',
            avatar: avatar || '👾',
            pitch_text: cleanText,
            status: 'reviewing',
            created_at: new Date().toISOString()
        };

        // Always save locally so the user can see their own pitches history
        saveLocalPitch(payload);

        if (!isConfigured()) {
            notifyPitchListeners(payload);
            return { success: true, localOnly: true, data: payload };
        }

        try {
            const { data, error } = await client
                .from('game_pitches')
                .insert([{
                    username: payload.username,
                    avatar: payload.avatar,
                    pitch_text: payload.pitch_text,
                    status: payload.status
                }])
                .select();

            if (error) throw error;
            return { success: true, data: data ? data[0] : payload };
        } catch (err) {
            console.error('❌ Failed to save pitch to Supabase, stored locally:', err);
            notifyPitchListeners(payload);
            return { success: true, localOnly: true, data: payload };
        }
    }

    async function fetchRecentPitches(limit = 40) {
        if (!isConfigured()) {
            return getLocalPitches();
        }

        try {
            const { data, error } = await client
                .from('game_pitches')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error || !data || data.length === 0) {
                return getLocalPitches();
            }
            return data;
        } catch (e) {
            return getLocalPitches();
        }
    }

    function saveLocalPitch(pitchObj) {
        try {
            const list = getLocalPitches();
            list.unshift(pitchObj);
            localStorage.setItem(STORAGE_LOCAL_PITCHES_KEY, JSON.stringify(list.slice(0, 100)));
        } catch (e) {}
    }

    function getLocalPitches() {
        try {
            const raw = localStorage.getItem(STORAGE_LOCAL_PITCHES_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    // ==========================================
    // AUTHENTICATION (OAUTH & GUEST/ANONYMOUS)
    // ==========================================
    async function signInWithOAuth(provider, options = {}) {
        if (!client) init();
        if (!isConfigured()) {
            return { error: new Error('Supabase is not configured yet. Please provide your Supabase URL & Anon Key.') };
        }
        try {
            const { url, anonKey } = getConfig();
            const cleanUrl = window.location.origin + window.location.pathname;
            const redirectTo = options.redirectTo || cleanUrl;

            // Pre-flight check: Verify if provider is enabled in Supabase backend
            // Prevents redirecting the browser to an unhandled 400 error page if provider is disabled in dashboard.
            if (url && anonKey) {
                try {
                    const probeUrl = `${url}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirectTo)}`;
                    const probeRes = await fetch(probeUrl, {
                        method: 'GET',
                        headers: { 'apikey': anonKey }
                    });

                    if (!probeRes.ok) {
                        const errJson = await probeRes.json().catch(() => ({}));
                        const errMsg = errJson.msg || errJson.error_description || errJson.message || `Provider ${provider} is not enabled`;
                        const isNotEnabled = errMsg.toLowerCase().includes('not enabled') ||
                                             errMsg.toLowerCase().includes('could not be found') ||
                                             errMsg.toLowerCase().includes('unsupported');
                        const customErr = new Error(errMsg);
                        customErr.isProviderDisabled = isNotEnabled;
                        customErr.provider = provider;
                        customErr.status = probeRes.status;
                        return { data: null, error: customErr };
                    }
                } catch (probeErr) {
                    // In case of network check failure, fall through to client SDK
                }
            }

            const { data, error } = await client.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: redirectTo,
                    ...options
                }
            });
            if (error) throw error;
            if (data && data.url) {
                window.location.assign(data.url);
            }
            return { data, error: null };
        } catch (err) {
            console.error(`❌ [KrazySupabase] signInWithOAuth failed for ${provider}:`, err);
            return { data: null, error: err };
        }
    }

    async function signInAnonymously() {
        if (!client) init();
        if (!isConfigured()) {
            return { error: new Error('Supabase is not configured yet.') };
        }
        try {
            if (typeof client.auth.signInAnonymously === 'function') {
                const { data, error } = await client.auth.signInAnonymously();
                if (error) throw error;
                return { data, error: null };
            }
            return { data: null, error: new Error('Anonymous sign-in not supported by current Supabase JS version.') };
        } catch (err) {
            console.warn('⚠️ [KrazySupabase] signInAnonymously error:', err);
            return { data: null, error: err };
        }
    }

    async function signOut() {
        if (isConfigured()) {
            try {
                await client.auth.signOut();
            } catch (err) {
                console.warn('⚠️ [KrazySupabase] signOut error:', err);
            }
        }
        return { success: true };
    }

    async function getSession() {
        if (!client) init();
        if (!isConfigured()) return { data: { session: null }, error: null };
        try {
            return await client.auth.getSession();
        } catch (err) {
            return { data: { session: null }, error: err };
        }
    }

    function onAuthStateChange(callback) {
        if (!client) init();
        if (!isConfigured()) return null;
        try {
            const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
                if (typeof callback === 'function') {
                    callback(event, session);
                }
            });
            return subscription;
        } catch (err) {
            console.warn('⚠️ [KrazySupabase] onAuthStateChange error:', err);
            return null;
        }
    }

    async function recordMultiplayerMatch({ gameId, roomCode, gameMode, player1Name, player2Name, winnerName, scoreDetails }) {
        if (!gameId) return null;
        const matchData = {
            game_id: gameId,
            room_code: roomCode || null,
            game_mode: gameMode || 'multiplayer',
            player1_name: player1Name || 'Player 1',
            player2_name: player2Name || 'Player 2',
            winner_name: winnerName || 'Draw',
            score_details: scoreDetails || {},
            created_at: new Date().toISOString()
        };

        // Always store locally as reliable offline store
        try {
            const STORAGE_MP_KEY = 'kf_multiplayer_match_history';
            const history = JSON.parse(localStorage.getItem(STORAGE_MP_KEY) || '[]');
            history.unshift(matchData);
            if (history.length > 50) history.pop();
            localStorage.setItem(STORAGE_MP_KEY, JSON.stringify(history));
            console.log('💾 [KrazySupabase] Match stored locally in browser history:', matchData);
        } catch (_) {}

        // Cloud write to Supabase if connected
        if (isConfigured()) {
            try {
                const { data, error } = await client
                    .from('multiplayer_matches')
                    .insert([matchData])
                    .select();
                if (error) {
                    console.warn('⚠️ [KrazySupabase] Cloud write multiplayer match warning:', error.message);
                } else {
                    console.log('🏆 [KrazySupabase] Match successfully written to Supabase cloud database:', data);
                    return data;
                }
            } catch (err) {
                console.warn('⚠️ [KrazySupabase] Cloud write exception:', err);
            }
        }
        return matchData;
    }

    async function getRecentMultiplayerMatches(gameId = null, limit = 10) {
        if (isConfigured()) {
            try {
                let query = client
                    .from('multiplayer_matches')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(limit);
                if (gameId) query = query.eq('game_id', gameId);
                const { data, error } = await query;
                if (!error && data) return data;
            } catch (err) {
                console.warn('Failed to fetch cloud matches:', err);
            }
        }
        // Local fallback
        try {
            const STORAGE_MP_KEY = 'kf_multiplayer_match_history';
            const history = JSON.parse(localStorage.getItem(STORAGE_MP_KEY) || '[]');
            if (gameId) return history.filter(m => m.game_id === gameId).slice(0, limit);
            return history.slice(0, limit);
        } catch (_) {
            return [];
        }
    }

    // ==========================================
    // GLOBAL HIGH SCORES LEADERBOARD API
    // ==========================================
    let leaderboardListeners = [];

    function onLeaderboardUpdate(callback) {
        if (typeof callback === 'function') leaderboardListeners.push(callback);
    }

    function notifyLeaderboardListeners(record) {
        leaderboardListeners.forEach(cb => {
            try { cb(record); } catch (e) { console.error(e); }
        });
    }

    // Default baseline hall-of-fame records per game so new players immediately see engaging targets
    const DEFAULT_LEADERBOARDS = {
        'elevator-doom': [
            { player_name: 'ApexSurv', player_avatar: '⚡', score: 98, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
            { player_name: 'DoomSlayer', player_avatar: '🔥', score: 87, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
            { player_name: 'NeonEcho', player_avatar: '👾', score: 74, created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
            { player_name: 'Vortex_99', player_avatar: '🚀', score: 65, created_at: new Date(Date.now() - 86400000).toISOString() },
            { player_name: 'CipherBlade', player_avatar: '🤖', score: 52, created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
        ],
        'flappy-man': [
            { player_name: 'SkyLord', player_avatar: '🦸‍♂️', score: 142, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
            { player_name: 'AeroAce', player_avatar: '🦅', score: 119, created_at: new Date(Date.now() - 3600000 * 7).toISOString() },
            { player_name: 'WingSpan', player_avatar: '⚡', score: 94, created_at: new Date(Date.now() - 3600000 * 18).toISOString() },
            { player_name: 'GliderPro', player_avatar: '🌟', score: 81, created_at: new Date(Date.now() - 86400000).toISOString() },
            { player_name: 'PixelCape', player_avatar: '👾', score: 68, created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
        ],
        'office-escape': [
            { player_name: 'CoffeeAddict', player_avatar: '☕', score: 4850, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
            { player_name: 'PaperPlane', player_avatar: '🏃', score: 4120, created_at: new Date(Date.now() - 3600000 * 9).toISOString() },
            { player_name: 'SprintMaster', player_avatar: '⚡', score: 3680, created_at: new Date(Date.now() - 3600000 * 22).toISOString() },
            { player_name: 'DeskJockey', player_avatar: '👔', score: 2940, created_at: new Date(Date.now() - 86400000).toISOString() },
            { player_name: 'LunchBreaker', player_avatar: '🍕', score: 2310, created_at: new Date(Date.now() - 86400000 * 3).toISOString() }
        ],
        'pop-up': [
            { player_name: 'PopQueen', player_avatar: '🎈', score: 3840, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
            { player_name: 'BurstKing', player_avatar: '💥', score: 3410, created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
            { player_name: 'NeedleGuy', player_avatar: '🎯', score: 2950, created_at: new Date(Date.now() - 3600000 * 15).toISOString() },
            { player_name: 'Balloony', player_avatar: '🎪', score: 2400, created_at: new Date(Date.now() - 86400000).toISOString() },
            { player_name: 'AirBlaster', player_avatar: '🚀', score: 1890, created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
        ],
        'dart-board': [
            { player_name: 'BullseyePro', player_avatar: '🎯', score: 501, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
            { player_name: 'DartMaster', player_avatar: '🏹', score: 480, created_at: new Date(Date.now() - 3600000 * 10).toISOString() },
            { player_name: 'TripleTwenty', player_avatar: '🔥', score: 420, created_at: new Date(Date.now() - 86400000).toISOString() }
        ]
    };

    function getLocalLeaderboard(gameId) {
        try {
            const key = `kf_leaderboard_${gameId}`;
            const raw = localStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (_) {}

        const defaults = DEFAULT_LEADERBOARDS[gameId] || [
            { player_name: 'ArcadeChamp', player_avatar: '👑', score: 1500, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
            { player_name: 'HyperGamer', player_avatar: '⚡', score: 1240, created_at: new Date(Date.now() - 3600000 * 6).toISOString() },
            { player_name: 'RetroLegend', player_avatar: '🕹️', score: 980, created_at: new Date(Date.now() - 86400000).toISOString() },
            { player_name: 'PixelNinja', player_avatar: '🥷', score: 760, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
            { player_name: 'KrazyPlayer', player_avatar: '👾', score: 540, created_at: new Date(Date.now() - 86400000 * 3).toISOString() }
        ];
        return defaults.map(d => ({ ...d, game_id: gameId }));
    }

    function saveLocalLeaderboard(gameId, record) {
        try {
            const key = `kf_leaderboard_${gameId}`;
            const list = getLocalLeaderboard(gameId);
            list.push(record);
            list.sort((a, b) => Number(b.score) - Number(a.score));
            localStorage.setItem(key, JSON.stringify(list.slice(0, 30)));
        } catch (_) {}
    }

    async function submitHighScore({ gameId, playerName, playerAvatar, score, userIdentifier }) {
        if (!gameId || typeof score === 'undefined' || isNaN(Number(score))) {
            return { success: false, error: 'Invalid score or gameId' };
        }

        const cleanScore = Math.round(Number(score));
        if (cleanScore <= 0) return { success: false, error: 'Score must be greater than 0' };

        const record = {
            id: 'score_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            game_id: gameId,
            player_name: playerName || 'Guest Gamer',
            player_avatar: playerAvatar || '👾',
            user_identifier: userIdentifier || ('user_' + (localStorage.getItem('kf_guest_id') || 'guest')),
            score: cleanScore,
            created_at: new Date().toISOString()
        };

        // 1. Always save in local storage fallback
        saveLocalLeaderboard(gameId, record);
        notifyLeaderboardListeners(record);
        window.dispatchEvent(new CustomEvent('krazy:leaderboard_updated', { detail: record }));

        // 2. Post to Supabase Cloud if online
        if (isConfigured()) {
            try {
                const { data, error } = await client
                    .from('game_leaderboards')
                    .insert([{
                        game_id: record.game_id,
                        player_name: record.player_name,
                        player_avatar: record.player_avatar,
                        user_identifier: record.user_identifier,
                        score: record.score
                    }])
                    .select();

                if (error) {
                    console.warn('⚠️ [KrazySupabase] Cloud leaderboard insert warning:', error.message);
                } else if (data && data[0]) {
                    console.log('🏆 [KrazySupabase] High score successfully posted to cloud:', data[0]);
                    return { success: true, cloud: true, data: data[0] };
                }
            } catch (err) {
                console.warn('⚠️ [KrazySupabase] Cloud leaderboard insert exception:', err);
            }
        }

        return { success: true, localOnly: true, data: record };
    }

    async function getLeaderboard(gameId, limit = 10) {
        if (!gameId) return [];

        if (isConfigured()) {
            try {
                const { data, error } = await client
                    .from('game_leaderboards')
                    .select('*')
                    .eq('game_id', gameId)
                    .order('score', { ascending: false })
                    .limit(limit);

                if (!error && data && data.length > 0) {
                    return data;
                }
            } catch (e) {
                console.warn('⚠️ [KrazySupabase] Fetch cloud leaderboard exception:', e);
            }
        }

        // Return local leaderboard fallback
        return getLocalLeaderboard(gameId).slice(0, limit);
    }

    function getClient() {
        if (!client) init();
        return client;
    }

    return {
        init,
        isConfigured,
        getConfig,
        saveCredentials,
        clearCredentials,
        updateConnectionUI,
        saveReaction,
        getGameReactionCounts,
        getAllReactionCounts,
        submitPitch,
        fetchRecentPitches,
        getLocalPitches,
        onReactionChange,
        onNewPitch,
        recordMultiplayerMatch,
        getRecentMultiplayerMatches,
        // Global High Scores Leaderboard
        submitHighScore,
        getLeaderboard,
        onLeaderboardUpdate,
        // Auth
        getClient,
        signInWithOAuth,
        signInAnonymously,
        signOut,
        getSession,
        onAuthStateChange
    };
})();

// Auto-initialize when window loads or immediately if SDK is ready
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    KrazySupabase.init();
}
window.addEventListener('DOMContentLoaded', () => {
    KrazySupabase.init();
});
