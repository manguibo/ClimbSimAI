# ClimbSimAI

Rule-based climbing beta generation and 2D wall visualization (V1).

## Requirements

- Node.js 20.x
- npm 10+
- Git
- GitHub account

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project scope (current)

- `UserMetricsForm`
- `WallViewer` (stateless, 2D grid)
- `POST /api/beta`
- Reach math + deterministic beta loop in `/lib`

## GitHub setup

```bash
git init
git branch -M main
git add .
git commit -m "chore: initialize ClimbSimAI V1 groundwork"
```

Create an empty GitHub repository named `ClimbSimAI`, then:

```bash
git remote add origin https://github.com/<your-username>/ClimbSimAI.git
git push -u origin main
```