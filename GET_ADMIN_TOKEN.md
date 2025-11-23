# How to Get Your InstantDB Admin Token

The RFP AI application requires an InstantDB **Admin Token** for the API routes to work properly.

## Steps to Get Your Admin Token:

1. **Go to InstantDB Dashboard**
   - Visit: https://www.instantdb.com/dash

2. **Select Your App**
   - Click on your app: `5fe5517c-1f4b-400c-ab57-c3300f8c8ced`

3. **Navigate to Settings**
   - Click on the "Settings" or "API Keys" section

4. **Copy the Admin Token**
   - Look for "Admin Token" or "Admin API Key"
   - Copy the token value

5. **Add to Your `.env` File**
   - Open your `.env` file
   - Add this line:
   ```
   INSTANTDB_ADMIN_TOKEN=your_admin_token_here
   ```

6. **Restart the Development Server**
   - Press Ctrl+C in the terminal to stop the server
   - Run `npm run dev` again

## Alternative: Use Mock Data (for testing without admin token)

If you want to test the UI without connecting to InstantDB, we can set up a mock data layer. Let me know if you'd like me to implement this temporary solution.

## Questions?

If you have any issues, check:
- InstantDB Discord: https://discord.com/invite/VU53p7uQcE
- InstantDB Docs: https://www.instantdb.com/docs/backend



