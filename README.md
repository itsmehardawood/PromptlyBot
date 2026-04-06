# **PromptlyBot**

### No-Code AI Chatbot for Service Providers

PromptlyBot is a no-code AI chatbot builder that allows service providers to create and embed an intelligent chatbot on their website without technical skills. Users simply fill out a setup form, add FAQs, and receive a one-line script tag to paste into their website’s `<head>` section.

---

## **How It Works**

1. **Fill Out the Setup Form**
   Enter your business details, chatbot personality, and basic information.

2. **Add FAQs**
   Add common questions and answers your clients normally ask.

3. **Copy Your Script**
   After completing setup, PromptlyBot generates a single one-liner script tag.

4. **Paste Into Your Website**
   Add the script inside your site’s `<head>` tag, and the chatbot appears automatically.

---

## **Tech Stack**

* Next.js
* React
* API Routes / Server Actions
* Vercel (recommended for deployment)

---

## **Development Setup**

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open the app:

```
http://localhost:3000
```

Edit the UI by modifying:

```
app/page.js
```

---

## **Environment Variables**

Create `.env.local` and add required keys:

```
NEXT_PUBLIC_API_BASE_URL=https://api.neurovise.co
NEXT_PUBLIC_API_KEY=your_key_here
```

(Add more variables as needed.)

---

## **Deployment**

Deploy easily on Vercel:

* [https://vercel.com](https://vercel.com)
* [https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)

---

## **Project Name**

`promptlybot`

---