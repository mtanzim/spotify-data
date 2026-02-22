import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import * as z from "zod";
const app = new Hono();

const baseUrl = process.env.BASE_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scopes = process.env.SCOPES;
const redirectUri = process.env.REDIRECT_URL;
const responseType = process.env.RESPONSE_TYPE;
const state = process.env.STATE;
const serverEncKey = process.env.SERVER_ENCRYPTION_KEY;

const anyEnvUndefinedOrEmpty = [
  baseUrl,
  clientId,
  clientSecret,
  scopes,
  redirectUri,
  responseType,
  state,
  serverEncKey,
].some((v) => {
  return !v;
});

if (anyEnvUndefinedOrEmpty) {
  throw new Error("please set up environment");
}

export const SpotifyTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default("Bearer"),
  scope: z.string(),
  expires_in: z.number().int(),
  refresh_token: z.string().optional(),
});

export type SpotifyTokenResponse = z.infer<typeof SpotifyTokenResponseSchema>;

app.use("/*", serveStatic({ root: "./public/" }));
app.get("/api/v1", (c) => c.text("Hello Bun!"));
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
  return c.text(authUrl);
});

app.get("/api/v1/callback", async (c) => {
  const { state: stateReadback, code } = c.req.query();
  if (stateReadback !== state) {
    return c.status(403);
  }
  if (!serverEncKey) {
    return c.status(500);
  }

  const parsedRes = SpotifyTokenResponseSchema.safeParse(
    await requestToken(code),
  );
  if (!parsedRes.success) {
    return c.status(500);
  }
  const secretPayload = JSON.stringify(parsedRes.data);
  const encoded = await encrypt(secretPayload);

  setCookie(c, "token", encoded);
  // try {
  //   const decrypted = await decrypt(encoded);
  //   console.log(JSON.parse(decrypted));
  // } catch (err) {
  //   console.log(err);
  // }
  return c.redirect("/");
});

// to generate key for env
// `bun -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`
async function encrypt(message: string) {
  if (!serverEncKey) {
    throw new Error("configure encryption key");
  }
  const keyData = Uint8Array.fromHex(serverEncKey);
  const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Fresh IV for every call
  const encoded = new TextEncoder().encode(message);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  // Combine IV and Ciphertext into one Buffer
  const combined = Buffer.concat([Buffer.from(iv), Buffer.from(ciphertext)]);
  return combined.toString("base64");
}

async function decrypt(base64Bundle: string) {
  if (!serverEncKey) {
    throw new Error("configure encryption key");
  }
  const keyData = Uint8Array.fromHex(serverEncKey);
  console.log(keyData.length);
  const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
  try {
    const decodedBundle = decodeURIComponent(base64Bundle);
    const combined = Buffer.from(decodedBundle, "base64");

    // console.log("Total Buffer Length:", combined.length);

    const iv = combined.subarray(0, 12);
    const ciphertext = combined.subarray(12);

    // console.log("Ciphertext (+ Tag) Length:", ciphertext.length);

    // If ciphertext.length < 16, it's impossible to decrypt (GCM tag is 16 bytes)
    if (ciphertext.length < 16) throw new Error("Ciphertext too short");

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );
    return new TextDecoder().decode(decryptedBuffer);
  } catch (e) {
    console.error("Decryption failed. Check key, IV, or cookie encoding.");
    throw e;
  }
}

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
