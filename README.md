# Fridge Recipes

A personal, single-user PWA. Take a photo of your fridge, correct the detected ingredients, and get three recipes from Claude.

Built with Next.js on Vercel, Supabase (auth and Postgres), the Anthropic API and Tailwind CSS.

## How sign-in works

You sign in with a one-time code from your email. An installed iPhone app has separate storage from Safari, so a sign-in link would log in Safari and leave the app signed out. Typing a code into the app avoids that.

## Setup

You need accounts with [Supabase](https://supabase.com), [Anthropic](https://console.anthropic.com) and [Vercel](https://vercel.com).

### 1. Create the Supabase project

Create a project, then copy the **Project URL** and **anon public key** from **Project Settings > API**.

### 2. Disable public signups

Go to **Authentication > Sign In / Providers** and turn off **Allow new users to sign up**. Leave the **Email** provider enabled.

The app also never creates users itself, and the API rejects any address other than `ALLOWED_EMAIL`.

### 3. Create your user

Go to **Authentication > Users > Add user > Create new user**. Enter your email and any strong password, and tick **Auto Confirm User**. The password is never used.

### 4. Put the code in the sign-in email

This step is required. The default template contains only a link, so the app would have nothing to type in.

Go to **Authentication > Emails**, open the **Magic Link** template, and replace the body with:

```html
<h2>Your Fridge Recipes code</h2>
<p>Enter this code in the app:</p>
<p style="font-size: 28px; font-weight: bold;">{{ .Token }}</p>
<p>Or, in a browser, <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">sign in with this link</a>.</p>
```

Supabase's built-in email service is heavily rate limited (a few messages per hour) and only delivers to members of your Supabase organization. Use the email you signed up to Supabase with, or configure custom SMTP under **Project Settings > Authentication**.

### 5. Run the migration

Open the **SQL Editor**, paste in the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and run it.

### 6. Set an Anthropic spend limit

Create an API key in the [Anthropic Console](https://console.anthropic.com), then set a monthly spend limit under **Settings > Limits**. This is your final protection if everything else fails.

### 7. Deploy to Vercel

Push this folder to a private Git repository and import it into Vercel, or run `npx vercel` from this folder.

Add these under **Settings > Environment Variables**:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_API_KEY` | Your Anthropic API key. Never prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key from step 1 |
| `ALLOWED_EMAIL` | The email from step 3 |

Redeploy after adding them, because `NEXT_PUBLIC_` values are built into the app.

### 8. Point Supabase at your site

Go to **Authentication > URL Configuration** and set **Site URL** to your Vercel URL. The link in the email uses it.

### 9. Install it on your phone

Open your Vercel URL, then:

- **iPhone:** in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** in Chrome, open the menu, then tap **Add to Home screen** or **Install app**.

Open the app from its new icon and sign in there, using the code from your email. Signing in through Safari won't carry over to the installed app.

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
