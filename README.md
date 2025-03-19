# SnapWit

**SnapWit** is an innovative web application that leverages AI to generate witty, engaging, and trend-aware comments for Twitter posts. Paste a tweet URL, and SnapWit’s AI, powered by Google Generative AI, crafts three unique replies tailored to the tweet’s context, complete with a credit system to keep things fresh. Built with a sleek React frontend and a robust Express backend, SnapWit features a responsive design with Tailwind CSS v4.0, custom gradient effects, and dark/light mode support.

Developed by Karan Vaishnav.

---

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features
- **AI-Driven Comments**: Generates three unique, context-aware comments per tweet using Google Generative AI, adapting to trends, memes, and user psychology.
- **Credit System**: Limits usage to 3 credits per tweet, encouraging fresh content with a regeneration option.
- **Twitter Integration**: Scrapes tweet content via Puppeteer and enables direct sharing of comments on Twitter.
- **Responsive Design**: Adapts seamlessly across devices with Tailwind CSS v4.0, featuring a radial gradient background and custom border effects.
- **Dark/Light Mode**: Toggleable theme with smooth gradient transitions.
- **Caching**: Stores comments and credits in memory for quick retrieval, with Redis session support on the backend.
- **Error Handling**: Graceful fallback for invalid URLs, API errors, or exhausted credits.

---

## Demo
Check out the live deployment:  
[**SnapWit on Vercel**](https://snapwit.vercel.app)  
(Backend hosted on Railway: `https://snapwit-production.up.railway.app`)

![SnapWit Screenshot](https://via.placeholder.com/800x400.png?text=SnapWit+Screenshot)  
*Replace with an actual screenshot or GIF of the app in action.*

---

## Architecture
SnapWit is split into two main components:
1. **Frontend (`snapwit-fe`)**:
   - React app for the user interface.
   - Communicates with the backend via Axios POST requests.
   - Styled with Tailwind CSS v4.0, featuring custom gradients.

2. **Backend (`snapwit-be`)**:
   - Express server handling API requests.
   - Uses Puppeteer to scrape tweet text from Twitter URLs.
   - Integrates Google Generative AI for comment generation.
   - Manages credits and caches responses in memory, with Redis for session storage.

---

## Installation

### Prerequisites
- **Node.js**: v16+ (for both FE and BE).
- **Google API Key**: For Google Generative AI (set in `.env`).
- **Redis**: For session storage (optional locally, required in production).
- **Chromium**: For Puppeteer (set path in `.env` if not using default)
- 

### Backend Setup (`snapwit-be`)
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/karan-vaishnav/snapwit-be.git
   cd snapwit-be
