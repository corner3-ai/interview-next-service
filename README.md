# interview-next-service

> **Take-home assignment**  
> Build a small Next.js (App Router) application that lets an interviewer compose a set of questions and then run a LiveKit audio call where an **AI agent** conducts the interview using those questions.

---

## 1 · Why this project?

We want to see how you:

* reason about product requirements and developer experience  
* structure a small but complete TypeScript/Next.js code-base  
* integrate an LiveKit API ([LiveKit](https://livekit.io/))  
* write clean, testable, well-documented code  

---

## 2 · What you need to build

| Route | Purpose | Notes |
|-------|---------|-------|
| **`/questionnaire-prompt-builder`** | UI that lets the interviewer enter or edit a *single* prompt (free-text) | *Persist* on **Save** – you may choose an in-memory store, the file-system, or a database (e.g. SQLite/PostgreSQL). |
| **`GET /api/questionnaire-prompt-builder`** | Returns `{ prompt: string }` | Consumed by the AI agent (see below). |
| **`/call`** | Creates a LiveKit room and perform the interview | The agent fetches the prompt via the endpoint above and performs the interview. |

### LiveKit 
Those LiveKit resources might be helpful:
- LiveKit [docs](https://docs.livekit.io/home/) 
- LiveKit Next.js [quickstart](https://docs.livekit.io/home/quickstarts/nextjs/)


### LiveKit AI Agent 

We include a minimal livekit agent: [interview-strella-agent](http://github.com/corner3-ai/interview-strella-agent)

* connects to the same LiveKit server as the browser client
* requests the prompt from `/api/questionnaire-prompt-builder`


---

## 4 · Getting started locally

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note that the provided agent expects `interview-next-service` to run on port `3000`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## 5 · How to submit your work

1. **Fork** this repository on GitHub.  
2. In the fork, create a branch named `submission/<your-github-username>` off `main`.  
3. **Keep the fork private** and grant *read* access to:  
   * `@lhylton`  
   * `@mr-robek`  
4. Develop on that branch. When you’re satisfied, open a **pull request** in *your own fork* from `submission/<your-github-username>` → `main`.  
   * In the PR description include:  
     * a checklist of finished requirements  
     * total time spent  
     * any known trade-offs / TODOs  
5. Tag the reviewers above so we get notified.    
6. **Do not** open PRs against the public upstream repo; we review only in your private fork.

⏱ **Suggested time budget**: 3–6 hours. Quality over scope!

---

## 6 · Need help? Ask early!

Please do not hesitate to reach out if you have any questions!

Good luck & have fun! 🚀