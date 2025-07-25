# Hunters's Strella Interview

This repo contains the code for the Strella interview challange. I focused on making the experience simple, clean, and easy to use. I kept things straightforward, and opted for these prebuilt solutions provided by LiveKit, rather than getting more manual with it like their React example shows.

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- LiveKit account and credentials
- The interview-strella-agent

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interview-next-service
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Fill in your LiveKit credentials in `.env`:
```
LIVEKIT_URL=your_livekit_server_url
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

## Running the Application

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Edit Interview Questions**: Click "Edit Prompt" to compose your interview questions
2. **Start Interview**: Click "Start Interview" to create a LiveKit room and begin the interview
3. **AI Agent**: The interview-strella-agent will automatically connect and conduct the interview using your custom questions

## API Endpoints

- `GET /api/questionnaire-prompt-builder` - Returns the current interview prompt
- `POST /api/questionnaire-prompt-builder` - Updates the interview prompt
- `GET /api/connection-details` - Generates LiveKit connection details for the interview room

## Running Tests

```bash
npm test
# or
npm run test:watch
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── connection-details/     # LiveKit room creation
│   │   └── questionnaire-prompt-builder/  # Prompt management
│   ├── call/                       # Interview room interface
│   ├── questionnaire-prompt-builder/      # Prompt editor UI
│   └── page.tsx                    # Main landing page
├── components/
│   ├── livekit/                    # LiveKit UI components
│   └── ui/                         # Reusable UI components
├── hooks/                          # Custom React hooks
└── lib/                           # Utility functions
```

## Technologies Used

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **LiveKit** for real-time audio communication
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Jest** for testing

## Acknowledgements

1. https://github.com/livekit-examples/agent-starter-react
2. https://github.com/corner3-ai/interview-next-service
3. https://github.com/corner3-ai/interview-strella-agent