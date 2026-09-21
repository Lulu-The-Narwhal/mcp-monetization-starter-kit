# MCP Monetization Starter Kit

Minimal reference MCP server — in **Python** and **TypeScript** — showing
opt-in integration of the open-source
[`lulu-ads`](https://github.com/Lulu-The-Narwhal/lulu-ads) monetization SDK.

Both servers expose one demo tool, `search_flights`. Everything else is
deliberately absent: no framework, no database, no build pipeline. The point
is to show exactly how much code monetization costs you.

It's one line.

## The integration

**Python** ([`python/server.py`](python/server.py)):

```python
from fastmcp import FastMCP
from lulu_ads.middleware import LuluAdsMiddleware

mcp = FastMCP("monetization-starter-kit")
mcp.add_middleware(LuluAdsMiddleware())   # <- the whole thing
```

**TypeScript** ([`typescript/src/server.ts`](typescript/src/server.ts)):

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withLuluAds } from "lulu-ads";

const server = new McpServer({ name: "monetization-starter-kit", version: "1.0.0" });
withLuluAds(server);   // <- the whole thing, call before registerTool
```

## Run it

| | |
|---|---|
| Python | `cd python && pip install -r requirements.txt && python server.py` |
| TypeScript | `cd typescript && npm install && npm start` |

Both run with **no credentials at all**. That's the first thing worth
verifying, and it's the subject of the next section.

## Opt-in means opt-in

The SDK is inert until you give it credentials. With `LULU_ADS_PUBLISHER_ID`
and `LULU_ADS_API_KEY` unset, the integration line never raises, never touches
the network, and your tool result comes back unmodified — byte for byte as if
the line weren't there.

To turn monetization on, set two environment variables:

```bash
export LULU_ADS_PUBLISHER_ID=pub_...
export LULU_ADS_API_KEY=lk_...
```

Get that pair at [getlulu.dev/publishers](https://getlulu.dev/publishers). No
key is ever hardcoded — every SDK entry point reads the environment.

## What actually gets added

Once configured, a filled slot adds a `sponsored` field to your tool's result
(TypeScript MCP servers receive it at `_meta["ads.getlulu.dev/sponsored"]`).

Be clear about what that means: **`sponsored` is data returned to the model.**
It is disclosed to the model as sponsored content. It is *not* automatically
rendered to the end user, and it is not an instruction — the SDK ships data,
never directives. If you want the user to see it, that is your decision and
your code. Presenting sponsored content to users without disclosing it as
sponsored is on you, not on the SDK.

A missing `sponsored` field is normal and is never an error. It means no
campaign matched, the client is unconfigured, or the backend didn't answer in
time. The SDK is fail-open by design: your tool must never break because an
ad didn't fill.

## Verified

Both reference servers are checked before release:

- `typescript/` — `npm install` and `tsc --noEmit` pass clean, and the built
  server answers a real MCP `initialize` + `tools/list` handshake over stdio
  with no credentials set.
- `python/` — installs, imports, middleware attaches, and the demo tool
  returns with no `sponsored` key when no credentials are set.

## Docs

- [SDK repository](https://github.com/Lulu-The-Narwhal/lulu-ads)
- [Quickstart](https://github.com/Lulu-The-Narwhal/lulu-ads/blob/master/docs/quickstart.md)
- [Integrations](https://github.com/Lulu-The-Narwhal/lulu-ads/blob/master/docs/integrations.md) — LangGraph, CrewAI, custom runtimes
- [Contract](https://github.com/Lulu-The-Narwhal/lulu-ads/blob/master/docs/contract.md) — what the SDK promises and what it never does

## License

MIT — see [LICENSE](LICENSE).
