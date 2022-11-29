Works With Cloudflare Functions and R2
=========

### To start local testing environment
```bash
wrangler pages dev -- npm start
```
To bind R2 locally, you need to use `miniflare` to setup a local server. You can find the instructions [here](https://miniflare.dev/storage/r2/).

### To test on feature or PROD
Simply, push your changes to a new branch, then wait until the build is finished. Go to Account Home > Pages > your Pages project > Deployment Details > Functions Tab.
Follow this [link](https://developers.cloudflare.com/pages/platform/functions/debugging-and-logging/) for more details.

### Available Functions
- `/r2/[prefix]/[fileName]` - returns the Wasm file from R2
