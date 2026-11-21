# Fridge Recipes

Take a photo of your fridge, fix the list of ingredients Claude spots, and get three recipe ideas. It installs on your phone's home screen like an app.

Built with Next.js, Supabase (sign-in and database), the Anthropic API and Tailwind CSS, and hosted on Vercel.

Each person runs their own copy. You use your own Supabase project, your own Anthropic API key and your own Vercel site, and only one email address can use each copy.

## What it costs

- **Supabase and Vercel:** the free plans are enough.
- **Anthropic:** you pay per use. Each photo or recipe request is one API call. You'll set a monthly spend limit in step 5 so it can't run away.

## Before you start

You need:

- Free accounts with [GitHub](https://github.com), [Supabase](https://supabase.com) and [Vercel](https://vercel.com), and an [Anthropic Console](https://console.anthropic.com) account with billing set up.
- To run it on your own computer (optional): [Node.js](https://nodejs.org) 20.9 or newer, and pnpm (run `corepack enable` once to get it).

## The keys you'll need

The app reads four values from environment variables, and nothing personal is stored in the code. You'll collect them during setup:

| Variable | What it is | Where you get it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project's address | Step 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase's **publishable** key (`sb_publishable_...`). It's safe in the browser, because database rules protect your data. | Step 2 |
| `ALLOWED_EMAIL` | The one email address allowed to use your copy | Step 3 |
| `ANTHROPIC_API_KEY` | Your Anthropic key (`sk-ant-...`). This one is secret. | Step 5 |

Keep these out of Git. Put them in Vercel's settings (step 6), or in `.env.local` when running on your computer, which Git ignores.

## Setup

### 1. Get your own copy

You can't push changes to this repository, so you need a copy of your own that Vercel can deploy from. Use one of these:

- **Fork it (easiest):** click **Fork** at the top of this page on GitHub. You'll get your own copy under your account.
- **Clone it into a new repository:** create an empty repository on GitHub, then run:

  ```bash
  git clone <this repository's URL> fridge-recipes
  cd fridge-recipes
  git remote set-url origin <your new repository's URL>
  git push -u origin main
  ```

Either way, your copy is yours: changes you make there don't affect anyone else's.

### 2. Create a Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Project Settings > API Keys** and copy two values:
   - **Project URL**, which looks like `https://abcdefgh.supabase.co`.
   - **Publishable key**, which starts with `sb_publishable_`. On older projects this is the **anon public** key under **Legacy API keys**, starting with `eyJ`. Either works.

> **Don't use the secret key** (`sb_secret_...` or `service_role`). It bypasses the database's security rules, and anything in a `NEXT_PUBLIC_` variable can be seen by anyone who opens the site. The app never needs it.

### 3. Lock down sign-in and create your user

1. Go to **Authentication > Sign In / Providers**. Turn **off** **Allow new users to sign up**, and leave the **Email** provider on.
2. Go to **Authentication > Users > Add user > Create new user**. Enter your email and a strong password, and tick **Auto Confirm User**.

You'll sign in to the app with this email and password. The app has no sign-up page and never sends emails. To change your password later, open your user on the same **Users** page.

### 4. Create the database tables

Open the **SQL Editor** in Supabase, paste in everything from [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and click **Run**.

This creates three tables: saved recipes, your pantry staples and an API usage log. It also adds security rules so each user can only see their own rows.

### 5. Get an Anthropic API key

1. In the [Anthropic Console](https://console.anthropic.com), create an API key and copy it. It starts with `sk-ant-`.
2. Go to **Settings > Limits** and set a monthly spend limit. If everything else fails, this caps what the app can cost you.

### 6. Deploy to Vercel

1. In Vercel, click **Add New > Project** and import your repository from step 1.
2. Leave **Root Directory**, **Framework Preset** and **Build and Output Settings** on their defaults.
3. Skip the optional Supabase integration. You're adding the values yourself, and it would add secret keys the app doesn't need.
4. Open **Environment Variables** and add these four:

   | Name | Value |
   | --- | --- |
   | `ANTHROPIC_API_KEY` | Your Anthropic key from step 5 |
   | `NEXT_PUBLIC_SUPABASE_URL` | The Project URL from step 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The publishable key from step 2 |
   | `ALLOWED_EMAIL` | The email you used in step 3 |

5. Click **Deploy**. When it finishes, Vercel shows your site's URL.

If you add or change a variable later, go to **Deployments** and redeploy. `NEXT_PUBLIC_` values are built into the app, so changes only take effect after a new deploy.

### 7. Put it on your phone

Open your Vercel URL on your phone, then:

- **iPhone:** in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** in Chrome, open the menu, then tap **Add to Home screen** or **Install app**.

Open the app from its new icon and sign in there. On iPhone the installed app keeps its storage separate from Safari, so signing in through Safari won't carry over.

## Running it on your computer

Do setup steps 2 to 5 first, then:

```bash
cp .env.example .env.local   # then fill in the four values
pnpm install
pnpm dev
```

Open http://localhost:3000. `.env.local` is ignored by Git, so your keys won't be committed.

The offline service worker only runs in production builds (`pnpm build && pnpm start`).

## Limits

- Photo analysis and regenerate calls share a limit of 20 per hour. To change it, edit `MAX_CALLS_PER_HOUR` in [`src/lib/guard.ts`](src/lib/guard.ts).
- Uploads are limited to 4 MB. Photos are resized in the browser to 1500px first, so a normal photo is far smaller.
- To change the Claude model, edit `MODEL` in [`src/lib/claude.ts`](src/lib/claude.ts).

## Default staples

New accounts start with salt, pepper, oil, butter, garlic, onion, rice, pasta, flour, sugar and common spices. Claude assumes you always have these, so it never lists them as missing. Edit your list on the **Pantry** page.
