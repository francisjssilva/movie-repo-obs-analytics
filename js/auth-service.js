// Authentication service for CineHub
// Handles user authentication with Supabase

class AuthService {
    constructor() {
        // Get Supabase instance from db-service
        this.supabase = null;
        this.currentUser = null;
        this.onAuthChangeCallbacks = [];
    }

    // Initialize with Supabase client
    init(supabaseClient) {
        this.supabase = supabaseClient;
        
        // Check for existing session
        this.checkSession();
        
        // Listen for auth state changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth state changed:', event);
            this.currentUser = session?.user || null;
            this.notifyAuthChange();
        });
    }

    // Check for existing session
    async checkSession() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            this.currentUser = session?.user || null;
            this.notifyAuthChange();
            return this.currentUser;
        } catch (error) {
            console.error('❌ Error checking session:', error);
            return null;
        }
    }

    // Sign up new user
    async signUp(email, password) {
        if (!this.supabase) {
            console.error('❌ Supabase client not initialized');
            return { success: false, error: 'Authentication service not ready. Please refresh the page.' };
        }
        
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            console.log('✅ User signed up:', data.user?.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in existing user
    async signIn(email, password) {
        if (!this.supabase) {
            console.error('❌ Supabase client not initialized');
            return { success: false, error: 'Authentication service not ready. Please refresh the page.' };
        }
        
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            console.log('✅ User signed in:', data.user?.email);
            this.currentUser = data.user;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out current user
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            console.log('✅ User signed out');
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Subscribe to auth state changes
    onAuthChange(callback) {
        this.onAuthChangeCallbacks.push(callback);
    }

    // Notify all subscribers of auth state change
    notifyAuthChange() {
        this.onAuthChangeCallbacks.forEach(callback => {
            callback(this.currentUser);
        });
    }

    // Add movie to user's favorites
    async addToFavorites(movieId, movieData) {
        if (!this.isAuthenticated()) {
            console.error('❌ Not authenticated - cannot add to favorites');
            return { success: false, error: 'Not authenticated' };
        }

        console.log('📝 Adding to favorites:', { userId: this.currentUser.id, movieId, movieData });

        try {
            const { data, error } = await this.supabase
                .from('user_favorites')
                .insert({
                    user_id: this.currentUser.id,
                    movie_id: movieId,
                    movie_data: movieData
                });

            if (error) throw error;
            console.log('✅ Added to favorites:', movieId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error adding to favorites:', error);
            return { success: false, error: error.message };
        }
    }

    // Remove movie from user's favorites
    async removeFromFavorites(movieId) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { error } = await this.supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', this.currentUser.id)
                .eq('movie_id', movieId);

            if (error) throw error;
            console.log('✅ Removed from favorites:', movieId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error removing from favorites:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's favorites
    async getFavorites() {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated', data: [] };
        }

        try {
            const { data, error } = await this.supabase
                .from('user_favorites')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching favorites:', error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // Add item to user's watched list
    async addToWatched(itemId, itemType, itemData) {
        if (!this.isAuthenticated()) {
            console.error('❌ Not authenticated - cannot add to watched');
            return { success: false, error: 'Not authenticated' };
        }

        console.log('📝 Adding to watched:', { userId: this.currentUser.id, itemId, itemType, itemData });

        try {
            const { data, error } = await this.supabase
                .from('user_watched')
                .insert({
                    user_id: this.currentUser.id,
                    item_id: itemId,
                    item_type: itemType,
                    item_data: itemData
                });

            if (error) throw error;
            console.log('✅ Added to watched:', itemId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error adding to watched:', error);
            return { success: false, error: error.message };
        }
    }

    // Remove item from user's watched list
    async removeFromWatched(itemId, itemType) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { error } = await this.supabase
                .from('user_watched')
                .delete()
                .eq('user_id', this.currentUser.id)
                .eq('item_id', itemId)
                .eq('item_type', itemType);

            if (error) throw error;
            console.log('✅ Removed from watched:', itemId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error removing from watched:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's watched items
    async getWatched(itemType = null) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Not authenticated', data: [] };
        }

        try {
            let query = this.supabase
                .from('user_watched')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .order('watched_at', { ascending: false });

            // Filter by type if specified
            if (itemType) {
                query = query.eq('item_type', itemType);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching watched items:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
}

// Create global instance
const authService = new AuthService();
