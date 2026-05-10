# MongoDB Setup Guide

This document provides step-by-step instructions for setting up MongoDB Atlas for the Meal Management application.

## Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account

### Step 2: Create a Free Cluster
1. Choose "FREE" tier (M0 Sandbox)
2. Select a cloud provider (AWS recommended)
3. Choose a region closest to you
4. Cluster name: `meal-management` (or keep default)
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. **Username**: Choose any username (e.g., `mealapp`)
5. **Password**: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is fine for development
   - For production, restrict to your server IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Go back to "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 6.8 or later
6. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update .env.local
1. Open your `.env.local` file
2. Replace the placeholders:
   ```env
   MONGODB_URI=mongodb+srv://mealapp:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. **Important**: URL-encode special characters in your password if any

### Step 7: Test the Connection
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Log in with Google
4. Try adding a meal
5. Check MongoDB Atlas:
   - Go to "Database" → "Browse Collections"
   - You should see `meal-management` database
   - Inside, you'll see a `meals` collection with your data

## Common Issues

### Issue: "MongoServerError: bad auth"
**Solution**: 
- Double-check username and password
- Ensure no extra spaces in `.env.local`
- Try generating a new password without special characters

### Issue: "Connection timeout"
**Solution**:
- Wait a few minutes for IP whitelist to propagate
- Verify 0.0.0.0/0 is added in Network Access
- Check your internet connection

### Issue: "Database user authentication failed"
**Solution**:
- Recreate the database user
- Make sure you selected "Read and write to any database"
- Try a simpler password (alphanumeric only)

### Issue: Environment variable not found
**Solution**:
- Restart your dev server after changing `.env.local`
- Ensure `.env.local` is in the root directory
- Check for typos in variable names

## URL Encoding Passwords

If your password contains special characters, they need to be URL-encoded:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `&` | `%26` |

Example:
- Password: `Pass@123#`
- Encoded: `Pass%40123%23`

## Production Checklist

When deploying to production:

- [ ] Create a separate MongoDB cluster for production
- [ ] Use strong, unique passwords
- [ ] Restrict Network Access to your server's IP addresses
- [ ] Enable MongoDB Atlas monitoring
- [ ] Set up automatic backups
- [ ] Create database indexes for better performance:
  ```javascript
  db.meals.createIndex({ userId: 1, date: -1 })
  db.meals.createIndex({ date: -1 })
  db.meals.createIndex({ userId: 1, date: 1, mealType: 1 })
  ```
- [ ] Update `MONGODB_URI` in production environment variables
- [ ] Test the connection before going live

## Data Validation Rules

The application enforces the following validation rules:

### Duplicate Meal Prevention
- **One meal type per day**: Users can only add one breakfast, lunch, dinner, or snack per day
- **Multiple deposits allowed**: Deposits have no limit and can be added multiple times per day
- **Edit validation**: When editing a meal, changing the type or date is validated against existing entries
- **Error messages**: Clear error messages are shown when attempting to add duplicate meals

Example scenarios:
- ✅ Allowed: Breakfast + Lunch + Dinner on same day
- ✅ Allowed: Multiple deposits on same day
- ❌ Not allowed: Two lunch entries on same day
- ❌ Not allowed: Changing a breakfast to lunch if lunch already exists for that date

## Next Steps

Once MongoDB is connected:

1. ✅ Add your first meal
2. ✅ Add a deposit
3. ✅ Edit a transaction
4. ✅ View monthly history
5. ✅ Check lifetime statistics

Your data is now persisted in MongoDB and will survive server restarts!

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Node.js Driver: https://www.mongodb.com/docs/drivers/node/
- Next.js Documentation: https://nextjs.org/docs

If you encounter issues not covered here, check the main README.md for more troubleshooting tips.
