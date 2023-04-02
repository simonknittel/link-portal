# Link Portal

## Demo

<https://link-portal-eight.vercel.app/>

_**Note:** This app may be slow at times. This is mainly due to Prisma not having proper support for PlanetScale in a serverless environment like Vercel yet._

## Usage

1. Duplicate `app/.env.example` to `app/.env` and fill in the blanks.
2. `nvm use`
3. `docker compose up`
4. `npx prisma db push`
5. `cd app/ && npm run dev`
6. <http://localhost:3000>

## Playwright tests

- `cd playwright/ && npx playwright test --debug`
