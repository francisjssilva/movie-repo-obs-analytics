# Authentication Setup Guide

CineHub now supports user authentication with personal favorites using Supabase Auth!

## Features
- ✅ Email/password authentication
- ✅ Automatic session management
- ✅ Personal favorites list
- ✅ No backend server needed
- ✅ Works on GitHub Pages

## Setup Instructions

### 1. Enable Authentication in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Settings**
4. Under **Auth Providers**, ensure **Email** is enabled
5. Configure email settings (you can use the built-in SMTP for testing)

### 2. Run Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and run the contents of `database/auth-migration.sql`
3. This creates the `user_favorites` table with proper RLS policies

### 3. Configure Auth Settings (Optional)

In Authentication → Settings:
- **Site URL**: Set to your GitHub Pages URL (e.g., `https://yourusername.github.io/movie-repo`)
- **Redirect URLs**: Add your GitHub Pages URL
- **Email Templates**: Customize signup/password reset emails

## How It Works

### User Registration
1. Click "Login" button in header
2. Click "Sign up" to create an account
3. Enter email and password
4. Check email for confirmation link
5. Click confirmation link to activate account

### User Login
1. Click "Login" button
2. Enter email and password
3. Session persists across page reloads

### Adding Favorites
1. Login to your account
2. Click the ❤️ button on any movie/TV show card
3. Favorites are saved to your account
4. Access your favorites from any device

### Security
- Passwords are hashed and never stored in plain text
- Row Level Security (RLS) ensures users only see their own data
- JWT tokens are automatically managed by Supabase
- Sessions are stored securely in browser localStorage

## Testing

### Test Account
Create a test account:
1. Use a real email (for confirmation)
2. Password must be at least 6 characters
3. Confirm email
4. Login and test favorites

### Local Testing
Works locally with `file://` protocol or any web server.

### GitHub Pages
Works perfectly on GitHub Pages - no backend needed!

## Troubleshooting

### Can't receive confirmation emails?
- Check Supabase email settings
- For testing, you can disable email confirmation in Authentication → Settings → Email Auth

### "Not authenticated" errors?
- Clear browser cache and localStorage
- Check browser console for errors
- Verify Supabase credentials in `js/db-service.js`

### Favorites not saving?
- Ensure `auth-migration.sql` was run successfully
- Check RLS policies are enabled
- Verify user is logged in (check console)

## Advanced Features

### Add More Auth Providers
Supabase supports:
- Google OAuth
- GitHub OAuth
- Twitter OAuth
- Magic Link (passwordless)

Configure in Authentication → Providers section.

### Extend User Data
Add more user-specific tables:
- User ratings
- Watch history
- Custom lists
- Reviews

Just create tables with `user_id` foreign key and RLS policies!

## Code Structure

- `js/auth-service.js` - Authentication logic
- `js/db-service.js` - Initializes Supabase client
- `js/script.js` - UI interactions
- `database/auth-migration.sql` - Database schema
- `css/styles.css` - Auth UI styling

## Support

For issues or questions:
1. Check Supabase [documentation](https://supabase.com/docs/guides/auth)
2. Review browser console for errors
3. Verify all migration steps completed

Enjoy your personalized movie experience! 🎬❤️
