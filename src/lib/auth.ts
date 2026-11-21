import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(); // database naam URI theke ashe (.../fixmate)

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
trustedOrigins: [
  process.env.BETTER_AUTH_URL as string,
  "http://localhost:3000",
  "https://fixmate-client-seven.vercel.app",
],

  emailAndPassword: { enabled: true, minPasswordLength: 6 },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 din login thakbe
    updateAge: 60 * 60 * 24,
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: true },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // admin kokhono signup e hobe na
        before: async (user) => ({
          data: {
            ...user,
            role:
              (user as { role?: string }).role === "technician"
                ? "technician"
                : "customer",
          },
        }),
      },
      // user nijer role update korte parbe na
      update: {
        before: async (user) => {
          const rest = { ...user } as { role?: string } & Record<string, unknown>;
          delete rest.role;
          return { data: rest };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
    nextCookies(),
  ],
});