# Meal Management Application

A modern, full-featured meal tracking application built with Next.js 16, TypeScript, MongoDB, and Tailwind CSS. Track your daily meals, monitor expenses, manage deposits, and analyze your eating habits with ease.

## Features

- 🔐 **Secure Authentication**: Google OAuth integration using NextAuth.js
- 📝 **Meal Tracking**: Log meals with date, type, description, and price
- 🚫 **Duplicate Prevention**: One meal type per day (breakfast, lunch, dinner, snack)
- ✏️ **Edit & Delete**: Edit existing meal entries or remove them
- 💰 **Deposit Management**: Track deposits and monitor your balance (unlimited per day)
- 📊 **Lifetime Statistics**: View total expenses, deposits, and balance across all time
- 🗓️ **Monthly History**: Browse transaction history month by month
- ⚡ **Quick Price Shortcuts**: Pre-configured price buttons (60, 70, 80, 85, 90, 100 Taka)
- 💾 **Smart Price Memory**: Remembers your last used price
- 🕐 **Auto Timestamps**: Backend-generated timestamps for accurate record keeping
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Mobile-First Design**: Optimized for mobile devices with responsive desktop view
- 🎨 **Modern UI**: Clean interface with Lucide icons

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database**: MongoDB
- **Authentication**: NextAuth.js v5 (beta) with Google Provider
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB Atlas account (free tier available)
- A Google Cloud Platform account for OAuth credentials

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Setting Up MongoDB

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Create a Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP Address**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Or add your current IP address for better security
   - Click "Confirm"

5. **Get Your Connection String**:
   - Go back to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<username>` with your database username
   - Add this to your `.env.local` file as `MONGODB_URI`

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

### Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
meal-management/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth API routes
│   │   └── meals/
│   │       ├── route.ts          # GET & POST meals API
│   │       └── [id]/route.ts     # PUT & DELETE meals API
│   ├── dashboard/                # Meal entry dashboard
│   ├── meals/                    # Month-wise meal viewing
│   ├── login/                    # Login page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── MealForm.tsx              # Meal entry form component
│   └── MealsView.tsx             # Monthly meals view component
├── context/
│   └── MealContext.tsx           # Meal state management with API calls
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   └── mongodb.ts                # MongoDB connection utility
├── types/
│   ├── index.ts                  # Type definitions
│   └── next-auth.d.ts            # NextAuth type extensions
└── .env.local                    # Environment variables
```

## API Routes

The application provides RESTful API endpoints for meal management:

### GET `/api/meals`
Fetch all meals for the authenticated user.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "date": "2026-05-03T12:00:00.000Z",
    "mealType": "lunch",
    "description": "Rice and chicken",
    "price": 80,
    "createdAt": "2026-05-03T12:00:00.000Z"
  }
]
```

### POST `/api/meals`
Add a new meal.

**Request Body:**
```json
{
  "userId": "user123",
  "date": "2026-05-03T12:00:00.000Z",
  "mealType": "lunch",
  "description": "Rice and chicken",
  "price": 80
}
```

### PUT `/api/meals/[id]`
Update an existing meal.

**Request Body:**
```json
{
  "date": "2026-05-03T13:00:00.000Z",
  "mealType": "dinner",
  "description": "Updated meal",
  "price": 90
}
```

### DELETE `/api/meals/[id]`
Delete a meal by ID.

**Response:**
```json
{
  "message": "Meal deleted successfully"
}
```

## Features Walkthrough

### Dashboard
- **Add Meals**: Log meals with date, time, type, description, and price
- **Add Deposits**: Track money deposits to monitor your balance
- **Quick Price Entry**: Use predefined price shortcuts (60, 70, 80, 85, 90, 100 Taka)
- **Smart Price Memory**: Automatically remembers your last used price
- **Today's Summary**: View real-time statistics for today's expenses and deposits
- **Recent Transactions**: See your latest meals and deposits
- **Quick Actions**: Edit or delete any transaction

### Meals View
- **Month Navigation**: Browse through months using arrow buttons
- **Lifetime Statistics**: 
  - Total meals count
  - Total deposits (all time)
  - Total expenses (all time)
  - Current balance (deposits - expenses)
  - Average price per meal
- **Transaction History**: See all transactions for the selected month
- **Day Grouping**: Transactions organized by date with daily summaries
- **Edit & Delete**: Modify or remove any transaction
- **Balance Tracking**: Separate deposit and expense calculations

### Edit Modal
- Click the pencil icon on any meal to edit
- Update meal type, description, price, date, and time
- Real-time validation
- Mobile-friendly design

### Authentication
- Secure Google OAuth login
- Protected routes (redirects to login if not authenticated)
- User session management
- User-specific data isolation

## Data Storage

Currently, the application uses **dummy data** stored in React Context (client-side state). This is ideal for:
- Development and testing
- Understanding the data structure
- Quick prototyping

### Moving to MongoDB

The application is designed to easily migrate to MongoDB. The data structure in `types/index.ts` is ready for MongoDB integration:

```typescript
interface Meal {
  id: string;           // Will become MongoDB _id
  userId: string;       // Reference to user
  date: string;         // ISO date string
  mealType: string;     // breakfast, lunch, dinner, snack
  description: string;  // Meal description
  price: number;        // Cost
  createdAt: string;    // Timestamp
}
```

To integrate MongoDB:
1. Install MongoDB packages: `npm install mongodb mongoose`
2. Create database connection in `lib/db.ts`
3. Create Mongoose models in `models/`
4. Replace Context API calls with API routes that interact with MongoDB
5. Update components to fetch data from API routes instead of Context

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain
5. Update Google OAuth redirect URI to your production domain

```bash
npm run build
npm start
```

## Future Enhancements

- [x] MongoDB integration ✅
- [x] Edit meal functionality ✅
- [x] Deposit tracking ✅
- [x] Lifetime statistics ✅
- [ ] Charts and data visualizations
- [ ] Export data to CSV/PDF
- [ ] Meal photos upload
- [ ] Budget goals and alerts
- [ ] Weekly/yearly summary reports
- [ ] Multiple currency support
- [ ] Meal categories and custom tags
- [ ] Recipe integration
- [ ] Sharing meals with friends/family

## Contributing

Contributions are welcome! Please feel free to submit issues and Pull Requests.

## License

MIT
