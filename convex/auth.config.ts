import { AuthConfig } from "convex/server";

const clerkIssuer =
  process.env.CLERK_FRONTEND_API_URL ?? process.env.CLERK_JWT_ISSUER_DOMAIN;

export default {
  providers: [
    {
      domain: clerkIssuer!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
