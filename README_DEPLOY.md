
# EduTwin Deploy Kit (Web + Backend)

Your project contains **Flutter frontend** (`frontend/`) and **Node/TypeScript backend** (`backend/`).  
This kit gives you a simple path to a **hosted web app** (GitHub Pages) and a hosted **API** (Render.com).

---

## 🌐 Host the Web App (GitHub Pages)
Requirements: a GitHub account and a repository.

1. Push your project (including this deploy kit) to a GitHub repo.  
   - Make sure `frontend/` and `backend/` are at the repo root, like this:
     ```
     /frontend
     /backend
     /.github/workflows/flutter_web_pages.yml
     render.yaml
     ```
2. Ensure your default branch is `main` (or edit the workflow to match your branch).  
3. Go to **Settings → Pages → Build and deployment** and choose **GitHub Actions**.  
4. Push a commit (or run the workflow manually under the **Actions** tab).  
5. After it finishes, your web app will be available at:
   - `https://<your-username>.github.io/<your-repo>/`

> The workflow builds Flutter Web from `frontend/` and publishes `frontend/build/web` to Pages.

---

## 🚀 Host the Backend API (Render)
1. Create an account at **render.com**.
2. Click **New +** → **Blueprint** and choose your repository.
3. Render will auto-detect **render.yaml** at the root. Confirm the service.
4. Add required environment variables under the service (e.g., API keys, DB connection).  
5. Deploy. Your API will have a public URL like `https://edutwin-backend.onrender.com`.

### Expected `backend/` scripts
In `backend/package.json`, make sure you have:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```
And a `tsconfig.json` that compiles to `dist/`.

---

## 🔗 Wire Frontend → Backend
In `frontend/lib/services/api.dart` (or your API file), set the base URL to your Render URL, e.g.:
```dart
const String apiBase = "https://edutwin-backend.onrender.com";
```
Rebuild and redeploy the web app to point at your live API.

---

## 🧪 Local Quick Test
- **Backend**: from `backend/`, run `npm install && npm run dev`.
- **Frontend (Flutter web)**: from `frontend/`, run:
  ```bash
  flutter config --enable-web
  flutter pub get
  flutter run -d chrome
  ```

---

## ❓Troubleshooting
- If GitHub Actions fails on Flutter version, bump `flutter-version` in the workflow.
- If Pages shows a 404, ensure the workflow published to `gh-pages` and Pages is set to use Actions.
- On Render, check logs for build errors (`npm install` / `tsc`). Ensure `dist/` is produced.
