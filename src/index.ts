import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant (POST /api/assistant/chat). Patches the Anthropic client
// so every reply the assistant writes is recorded. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "43ca8348-61ae-46bc-9bd8-1a9447a0a45c",
  agentId: "oVgDctIkjq6n20Wk4kEre0EJVqQ",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Send Pendo's buffered events before the process exits.
server.on("close", () => {
  void pendo.shutdown();
});

async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => {
  void stop();
});
process.on("SIGTERM", () => {
  void stop();
});
