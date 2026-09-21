# Python reference server

FastMCP server with one demo tool and a one-line `lulu-ads` integration.

```bash
pip install -r requirements.txt
python server.py
```

Runs with no credentials. `LuluAdsMiddleware()` is inert until
`LULU_ADS_PUBLISHER_ID` and `LULU_ADS_API_KEY` are set — it never raises and
never calls the network, and `search_flights` returns unmodified.

To enable monetization:

```bash
export LULU_ADS_PUBLISHER_ID=pub_...
export LULU_ADS_API_KEY=lk_...
```

Credentials come from [getlulu.dev/publishers](https://getlulu.dev/publishers).

Once configured, filled slots add a `sponsored` key to the tool result. That
field is data disclosed to the model — rendering it to the end user is your
decision. A missing `sponsored` key is normal, never an error.

See the [root README](../README.md) for the full explanation.
