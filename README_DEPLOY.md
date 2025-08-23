# 🚀 Edutwin Deployment Guide

## Frontend (Flutter Web → GitHub Pages)
1. Push code to **main** branch.
2. GitHub Actions will build Flutter Web automatically.
3. Site will be deployed at: `https://<username>.github.io/<repo>/`.

## Backend (Express → Render)
1. Connect repo to [Render](https://render.com).
2. It will detect `render.yaml` and deploy backend.
3. Your backend API will be live on Render URL.

Enjoy 🎉
