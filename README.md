# Link Portal

## Demo

<https://link-portal-eight.vercel.app/>

_**Note:** This app may be slow at times. This is mainly due to Prisma not having proper support for PlanetScale in a serverless environment like Vercel yet._

## Usage

1. Duplicate `app/.env.example` to `app/.env`
2. `nvm use`
3. `prisma org switch simonknittel-link-portal`
4. `prisma connect link-portal development`
5. `cd app/ && npm run dev`
6. <http://localhost:3000>
