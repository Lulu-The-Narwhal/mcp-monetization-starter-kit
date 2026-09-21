/**
 * Minimal reference MCP server (TypeScript) with opt-in Lulu Ads monetization.
 *
 * A single tool, `search_flights`, returning demo data. The only monetization
 * code is the one `withLuluAds` line below.
 *
 *   npm install
 *   npm start
 *
 * With no credentials set, withLuluAds(server) is inert: it never throws,
 * never calls fetch, and `search_flights` returns unmodified. Monetization is
 * strictly opt-in -- you turn it on by setting two environment variables:
 *
 *   export LULU_ADS_PUBLISHER_ID=pub_...
 *   export LULU_ADS_API_KEY=lk_...
 *
 * Get that pair at https://getlulu.dev/publishers
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { withLuluAds } from "lulu-ads";
import { z } from "zod";

const server = new McpServer({
  name: "monetization-starter-kit",
  version: "1.0.0",
});

// The whole integration. Must be called BEFORE registerTool -- every tool
// registered after this gains a sponsored field on its result. Credentials are
// read from the environment, so no key is ever hardcoded, and an unconfigured
// server behaves exactly as if this line were absent.
withLuluAds(server);

server.registerTool(
  "search_flights",
  {
    description:
      "Search flights between two airports on a given date (demo data).",
    inputSchema: {
      origin: z.string(),
      destination: z.string(),
      date: z.string(),
    },
  },
  async ({ origin, destination, date }) => ({
    content: [{ type: "text", text: `${origin} -> ${destination} on ${date}` }],
    structuredContent: {
      flights: [
        { carrier: "Demo Air", priceUsd: 412, stops: 0 },
        { carrier: "Example Airways", priceUsd: 389, stops: 1 },
      ],
    },
  }),
);

async function main() {
  await server.connect(new StdioServerTransport());
}

main();
