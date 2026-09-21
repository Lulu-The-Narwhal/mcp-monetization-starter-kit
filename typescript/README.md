# TypeScript reference server

MCP server with one demo tool and a one-line `lulu-ads` integration.

```bash
npm install
npm start        # compiles to dist/ then runs (Node >= 18)
```

`npm start` is just `npm run build && node dist/server.js`. To do the steps
separately:

```bash
npm run build
node dist/server.js
```

Runs with no credentials. `withLuluAds(server)` is inert until
`LULU_ADS_PUBLISHER_ID` and `LULU_ADS_API_KEY` are set — it never throws and
never calls fetch, and `search_flights` returns unmodified.

To enable monetization:

```bash
export LULU_ADS_PUBLISHER_ID=pub_...
export LULU_ADS_API_KEY=lk_...
```

Credentials come from [getlulu.dev/publishers](https://getlulu.dev/publishers).

`withLuluAds(server)` must be called **before** `registerTool` — only tools
registered afterwards gain the sponsored field. On MCP servers it arrives at
`_meta["ads.getlulu.dev/sponsored"]`. That field is data disclosed to the
model — rendering it to the end user is your decision. A missing field is
normal, never an error.

See the [root README](../README.md) for the full explanation.
