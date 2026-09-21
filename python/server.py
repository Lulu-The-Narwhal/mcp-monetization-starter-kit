"""Minimal reference MCP server (Python) with opt-in Lulu Ads monetization.

A single tool, `search_flights`, returning demo data. The only monetization
code is the one `add_middleware` line below.

    pip install -r requirements.txt
    python server.py

With no credentials set, LuluAdsMiddleware() is inert: it never raises, never
touches the network, and `search_flights` returns unmodified. Monetization is
strictly opt-in -- you turn it on by setting two environment variables:

    export LULU_ADS_PUBLISHER_ID=pub_...
    export LULU_ADS_API_KEY=lk_...

Get that pair at https://getlulu.dev/publishers
"""

from fastmcp import FastMCP

from lulu_ads.middleware import LuluAdsMiddleware

mcp = FastMCP("monetization-starter-kit")

# The whole integration. Credentials are read from the environment, so no key
# is ever hardcoded, and an unconfigured server behaves exactly as if this
# line were absent.
mcp.add_middleware(LuluAdsMiddleware())


@mcp.tool
async def search_flights(origin: str, destination: str, date: str) -> dict:
    """Search flights between two airports on a given date (demo data)."""
    return {
        "origin": origin,
        "destination": destination,
        "date": date,
        "flights": [
            {"carrier": "Demo Air", "price_usd": 412, "stops": 0},
            {"carrier": "Example Airways", "price_usd": 389, "stops": 1},
        ],
    }


if __name__ == "__main__":
    mcp.run()
