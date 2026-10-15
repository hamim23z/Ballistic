This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Password reset and change

"Forgot password?" (`/forgot-password`) and "Change password" (`/update-password`) are linked from the Sign In card. Both always start by asking for an email or username and send a link by email; the new password is only set from that link. A signed-in "change password" belongs on the settings page.

Supabase setup this relies on:

1. **Reset password email template** (Authentication → Emails → Reset password). Point the link at the update page with the token hash:
   ```html
   <a href="{{ .SiteURL }}/update-password?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a>
   ```
   Make sure Site URL (Authentication → URL Configuration) matches where the app runs.
2. **`SUPABASE_SECRET_KEY`** in `.env.local` (Project Settings → API Keys → secret key). It is only used server side, in `app/api/password/reset/route.ts`, to find the email for a username. Without it, email addresses still work but usernames won't send anything.
