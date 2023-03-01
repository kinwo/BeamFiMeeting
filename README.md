# BeamFi Meeting Monorepos

This repos is based on pnpm starter turborepo template.

## Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Quick Start

- Install pnpm https://pnpm.io/
- Install Vercel CLI https://vercel.com/docs/cli

```
pnpm i -g vercel
```

- Login Vercel

```
vercel login
```

- Link apps/api to Vercel
  choose beam-fi-meeting-api

```
cd apps/api
vercel link
```

- Setup env vars for apps/api:

```
vercel env pull .env.local
```

- Run install in root
  Go back to the project root dir

```
pnpm install
```

## Build

To build all apps and packages, run the following command:

```
pnpm run build
```

## Develop

To develop all apps and packages, run the following command:

```
pnpm run dev
```

## Troubleshooting

Parsing error: Cannot find module 'next/babel' in Visual Studio Code

Add following to VSCode settings.json:

```
"eslint.packageManager": "pnpm"
```

https://github.com/vercel/next.js/issues/40687  
https://stackoverflow.com/questions/68163385/parsing-error-cannot-find-module-next-babel/70421220#70421220
