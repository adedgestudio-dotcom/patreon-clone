import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../models/user";

export const authOptions = NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "NextAuth.js <no-reply@example.com>",
    // }),
  ],
  callbacks: {
    // ✅ This function runs WHEN a user tries to sign in
    async signIn({ user, account }) {
      // Just printing data in terminal for debugging
      console.log("SignIn callback - User:", user);
      console.log("SignIn callback - Account:", account);

      // Check if the login provider is GitHub
      if (account.provider === "github") {
        try {
          // 🔌 Connect to MongoDB database
          await mongoose.connect(process.env.MONGODB_URI);

          // 🔍 Check if user already exists in DB using email
          const currentUser = await User.findOne({ email: user.email });
          console.log("Current user from DB:", currentUser);

          // ❓ If user NOT found in DB
          if (!currentUser) {
            // 🆕 Create a new user document
            const newUser = new User({
              email: user.email, // save email
              username: user.email.split("@")[0], // create username from email
            });

            // 💾 Save new user to database
            await newUser.save();

            console.log("New user created:", newUser);
          }

          // ✅ Allow user to sign in
          return true;
        } catch (error) {
          // ❌ If database connection or save fails
          console.error("Database error:", error);

          // ⚠️ Still allow sign-in so app doesn't break
          return true;
        }
      }

      // ✅ Allow sign in for other providers (Google, etc.)
      return true;
    },

    // ✅ This function runs AFTER login, every time session is checked
    async session({ session, token }) {
      // Debug logs
      console.log("Session callback - Session:", session);
      console.log("Session callback - Token:", token);

      try {
        // 🔌 Connect to MongoDB again
        await mongoose.connect(process.env.MONGODB_URI);

        // 🔍 Find user from DB using session email
        const dbUser = await User.findOne({ email: session.user.email }); //db-database
        console.log("DB User in session:", dbUser);

        // ❓ If user exists in DB
        if (dbUser) {
          // ✍️ Add username from DB into session
          session.user.name = dbUser.username;
          session.user.username = dbUser.username;
        }
      } catch (error) {
        // ❌ If DB fails, just log error (don't crash app)
        console.error("Session callback error:", error);
      }

      // 📦 Final session object sent to frontend
      console.log("Final session:", session);

      // 🔁 Return updated session
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };
