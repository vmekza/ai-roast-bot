# Bobbsey Chat Bot

**Bobbsey** is a React-based chat application that features a friendly AI assistant who can switch between **Normal** and **Roast** modes.

## Features

- **Dual Modes**: Toggle between a polite assistant (Normal) and a playful roast manager (Roast).
- **Voice Input & Output**: Speak to Bobbsey and have responses read aloud.
- **Typing Animation**: Realistic “thinking…” indicator with animated dots.
- **Responsive Design**: Mobile‑first layout that scales smoothly up to desktop.

## Demo

## Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/vmekza/ai-roast-bot.git
cd ai-roast-bot
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env        # copy example env file
# Edit .env and set your OpenAI API key:
# OPENAI_API_KEY=your_api_key_here
npm start                    # starts the server on http://localhost:5000
```

#### Frontend

```bash
cd frontend
npm install
npm start                    # starts React app on http://localhost:3000
```
