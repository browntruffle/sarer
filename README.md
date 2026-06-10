# Alex Benjamin Kyeyune — Personal YouTube Creator Site

Static site scaffold for a personal creator page. Includes:

- `index.html` — Homepage with hero and latest videos
- `about.html` — About and social links
- `css/styles.css` — Styling
- `js/scripts.js` — Loads videos from `data/videos.json` or YouTube Data API
- `data/videos.json` — Sample video list (replace with your videos)

How to use

1. Open `index.html` in a browser.
2. To show your latest YouTube videos automatically, set `API_KEY` and `CHANNEL_ID` in `js/scripts.js`.
   - Get an API key from Google Cloud and enable the YouTube Data API v3.
   - Recommended: create a local `js/config.json` (this repo ignores it) instead of editing `js/scripts.js`.
     Use `js/config.example.json` as a template. Example `js/config.json`:

```json
{
  "API_KEY": "YOUR_YOUTUBE_DATA_API_KEY_HERE",
  "CHANNEL_ID": "UCUcbceZxb_OnDpgSJAOsXEA"
}
```

   - Note: embedding an API key in client-side JavaScript exposes it to users. For a secure setup use a server-side proxy or serverless function to keep the key private.
3. Or edit `data/videos.json` with your latest video IDs and titles.

Deploying to GitHub Pages

1. Create a GitHub repository for this project and push your local code to the `main` (or `master`) branch.

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. The included GitHub Actions workflow `.github/workflows/deploy.yml` will run on push and publish the repository root to GitHub Pages. Open the repository Settings → Pages and ensure "GitHub Actions" is selected as the source if it's not already.

3. (Optional) If you want a custom domain, add a `CNAME` file at the repo root with your domain and configure DNS accordingly.

Notes
- The workflow deploys the repository root. If you only want a subfolder published, update the `path` in the workflow `Upload Pages Artifact` step.
- GitHub Pages serves static content; if you need server-side protection for your API key, consider deploying a small serverless function instead.

Need help customizing styles, adding a contact form, or deploying? Ask and I can help.
