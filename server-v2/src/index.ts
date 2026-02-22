import { randomUUIDv5 } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

const baseUrl = process.env.BASE_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scopes = process.env.SCOPES;
const redirectUri = process.env.REDIRECT_URL;
const responseType = process.env.RESPONSE_TYPE;
const state = process.env.STATE;

const anyEnvUndefinedOrEmpty = [
  baseUrl,
  clientId,
  clientSecret,
  scopes,
  redirectUri,
  responseType,
  state,
].some((v) => {
  return !v;
});

if (anyEnvUndefinedOrEmpty) {
  throw new Error("please set up environment");
}

app.use("/*", serveStatic({ root: "./public/" }));
app.get("/api/v1/", (c) => c.text("Hello Bun!"));
app.post("/api/v1/authorize", (c) => {
  const authUrl =
    baseUrl +
    "/authorize" +
    "?client_id=" +
    clientId +
    "&redirect_uri=" +
    redirectUri +
    "&scope=" +
    scopes +
    "&response_type=" +
    responseType +
    "&state=" +
    state;
  return c.redirect(authUrl);
});

app.get("/api/v1/callback", (c) => {
  const { state: stateReadback, code } = c.req.query();
  if (stateReadback !== state) {
    return c.status(403);
  }
});

// requestToken exchanges an authorization code for tokens from Spotify.
async function requestToken(code: string): Promise<Record<string, any>> {
  const data = new URLSearchParams();
  data.set("code", code);
  data.set("redirect_uri", redirectUri!);
  data.set("grant_type", "authorization_code");

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: data.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.statusText}`);
  }

  const result: Record<string, any> = await response.json();
  return result;
}

export default app;
