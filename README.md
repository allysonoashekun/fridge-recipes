# Fridge Recipes

A personal, single-user PWA. Take a photo of your fridge, correct the detected ingredients, and get three recipes from Claude.

Built with Next.js on Vercel, Supabase (auth and Postgres), the Anthropic API and Tailwind CSS.

## How sign-in works

You sign in with your email and password. No sign-in emails are sent, so there are no email templates or email rate limits to deal with.

## Setup

You need accounts with [Supabase](https://supabase.com), [Anthropic](https://console.anthropic.com) and [Vercel](https://vercel.com).

### 1. Create the Supabase project

Create a project, then copy the **Project URL** and **anon public key** from **Project Settings > API**.

### 2. Disable public signups

Go to **Authentication > Sign In / Providers** and turn off **Allow new users to sign up**. Leave the **Email** provider enabled.

The app also never creates users itself, and the API rejects any address other than `ALLOWED_EMAIL`.

### 3. Create your user

Go to **Authentication > Users > Add user > Create new user**. Enter your email and a strong password, and tick **Auto Confirm User**. This is the password you sign in to the app with.

To change it later, open the user under **Authentication > Users** and set a new password.

### 4. Run the migration

Open the **SQL Editor**, paste in the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and run it.

### 5. Set an Anthropic spend limit

Create an API key in the [Anthropic Console](https://console.anthropic.com), then set a monthly spend limit under **Settings > Limits**. This is your final protection if everything else fails.

### 6. Deploy to Vercel

Push this folder to a private Git repository and import it into Vercel, or run `npx vercel` from this folder.

Add these under **Settings > Environment Variables**:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_API_KEY` | Your Anthropic API key. Never prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key from step 1 |
| `ALLOWED_EMAIL` | The email from step 3 |

Redeploy after adding them, because `NEXT_PUBLIC_` values are built into the app.

### 7. Install it on your phone

Open your Vercel URL, then:

- **iPhone:** in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** in Chrome, open the menu, then tap **Add to Home screen** or **Install app**.

Open the app from its new icon and sign in there with your email and password. An installed iPhone app keeps its storage separate from Safari, so signing in through Safari won't carry over to the app.

## Local development

```bash
cp .env.example .env.local   # then fill in the values
pnpm install
pnpm dev
```

The service worker only registers in production builds.

## Limits

- Analyze and regenerate calls share a limit of 20 per hour, tracked in `api_usage`.
- Uploads are limited to 4 MB. Photos are resized in the browser to 1500px first, so a normal photo is far smaller.
- To change the limit, edit `MAX_CALLS_PER_HOUR` in [`src/lib/guard.ts`](src/lib/guard.ts).
- To change the model, edit `MODEL` in [`src/lib/claude.ts`](src/lib/claude.ts).

## Default staples

New accounts start with salt, pepper, oil, butter, garlic, onion, rice, pasta, flour, sugar and common spices. Edit your list on the Pantry page.
