import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const SIGN_IN_HANDLERS = {
  // @ts-ignore
  credentials: async (_user, _account, _profile, _email, _credentials) => {
    return true;
  },
  // @ts-ignore
  google: async (_user, account, _profile, _email, _credentials) => {
    try {
      const response = await axios({
        method: "post",
        url: process.env.AUTH_BACKEND_URL + "auth/google/",
        data: {
          access_token: account["access_token"],
          id_token: account["id_token"],
        },
      });
      account["meta"] = response.data;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_ACCESS_TOKEN_LIFETIME,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // The data returned from this function is passed forward as the
      // `user` variable to the signIn() and jwt() callback
      async authorize(credentials, _req) {
        try {
          const response = await axios({
            url: process.env.AUTH_BACKEND_URL + "auth/login/",
            method: "post",
            data: credentials,
          });
          const data = response.data;
          if (data) return data;
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!account) return false;
      if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
      return SIGN_IN_HANDLERS[
        account.provider as keyof typeof SIGN_IN_HANDLERS
      ](user, account, profile, email, credentials);
    },
    async jwt({ user, token, account }) {
      // If `user` and `account` are set that means it is a login event
      if (user && account) {
        let backendResponse: any =
          account.provider === "credentials" ? user : account.meta;
        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }
      // Refresh the backend token if necessary
      if (getCurrentEpochTime() > (token["ref"] as number)) {
        const response = await axios({
          method: "post",
          url: process.env.NEXTAUTH_BACKEND_URL + "auth/token/refresh/",
          data: {
            refresh: token["refresh_token"],
          },
        });
        token["access_token"] = response.data.access;
        token["refresh_token"] = response.data.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
      }
      return token;
    },
    // Since we're using Django as the backend we have to pass the JWT
    // token to the client instead of the `session`.
    async session({ token }) {
      return token as any; // NOSONAR
    },
  },
});
