import "dotenv/config";

const configuredSecret = process.env.JWT_SECRET;

if (
  process.env.NODE_ENV === "production" &&
  (!configuredSecret || configuredSecret === "supersecret")
) {
  throw new Error("Set a private JWT_SECRET before starting the backend in production.");
}

// Keep local development convenient; production must use a private secret.
export const JWT_SECRET = configuredSecret || "supersecret";
