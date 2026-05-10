import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { getDatabase } from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Use JWT for middleware compatibility
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if user is admin
        const isAdmin = user.email === process.env.ADMIN_EMAIL;
        
        const db = await getDatabase();
        
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email: user.email });
        
        if (existingUser) {
          // Existing user: only update isAdmin, preserve isVerified
          await db.collection('users').updateOne(
            { email: user.email },
            {
              $set: {
                isAdmin: isAdmin,
              },
            }
          );
          console.log('Existing user sign in:', user.email, 'isAdmin:', isAdmin, 'isVerified preserved');
        } else {
          // New user: set both isAdmin and initial isVerified status
          await db.collection('users').updateOne(
            { email: user.email },
            {
              $set: {
                isAdmin: isAdmin,
                // Admin is auto-verified, others start as unverified
                isVerified: isAdmin ? true : false,
              },
            },
            { upsert: false }
          );
          console.log('New user created:', user.email, 'isAdmin:', isAdmin, 'isVerified:', isAdmin);
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Allow sign in even if update fails
      }
    },
    async jwt({ token, user }) {
      // On sign in, save user id to token
      if (user) {
        token.id = user.id;
        
        // Fetch user from database to get isAdmin and isVerified
        try {
          const db = await getDatabase();
          const dbUser = await db.collection('users').findOne({ email: user.email });
          
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin || false;
            token.isVerified = dbUser.isVerified || false;
          } else {
            token.isAdmin = false;
            token.isVerified = false;
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error);
          token.isAdmin = false;
          token.isVerified = false;
        }
        
        console.log('JWT created for user:', user.id, user.email, 'isAdmin:', token.isAdmin, 'isVerified:', token.isVerified);
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id from token to session
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.isAdmin = (token.isAdmin as boolean) || false;
        session.user.isVerified = (token.isVerified as boolean) || false;
      }
      return session;
    },
  },
});
