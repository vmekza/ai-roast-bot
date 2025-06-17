# Bobbsey Chat Bot

## Live Demo

Check it out here: https://bobbsey.netlify.app

**Bobbsey** is a React-based chat application that features a friendly AI assistant who can switch between Normal and Roast modes.

## Prerequisites

- Node >= 16
- npm or yarn
- A Netlify account & CLI (for local dev)

## Getting Started

### Installation

1. **Clone & install**

```bash
git clone https://github.com/vmekza/ai-roast-bot.git
cd frontend
npm install
```

2. **Set your OpenAI key**
   Create a **.env file in frontend/**:

```bash
echo "OPENAI_API_KEY=sk-…" > .env
```

3. **Run with Netlify Dev**

```bash
npm install -g netlify-cli
netlify dev
```

Your React app will be at ➔ http://localhost:8888
