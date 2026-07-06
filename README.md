# SkillForge 🚀

**🌍 Live Demo:** [https://skillforgeapp.vercel.app/](https://skillforgeapp.vercel.app/)

SkillForge is a full-stack, AI-powered career and skill development platform designed to help users map out their learning journeys, test their coding skills, compete in coding arenas, and get intelligent career insights. 

## ✨ Key Features
- **AI Mentor & Chat History:** Persistent, intelligent career and coding mentor powered by Google Gemini. Your chats are saved so you can pick up exactly where you left off.
- **Battle Ground Arena:** Compete against other developers in a real-time coding arena and earn points to climb the global leaderboard.
- **Adaptive Assessments:** Test your knowledge in specific Software Engineering and AI domains. Questions adapt dynamically based on your profile interests to help build your confidence.
- **Dynamic AI Roadmaps:** Generates structured, step-by-step learning roadmaps for any technical skill, completely tailored to your current level.
- **Interactive Coding Playground:** A built-in code execution sandbox that natively compiles and runs Python and Node.js code directly on the backend.
- **Profile Settings & Global Theme:** Customize your avatar, select your primary tech stacks to personalize your assessments, and seamlessly toggle between a stunning Light and Dark Mode UI.
- **Resume Analyzer:** Upload a PDF resume to get instant, AI-driven critique, formatting suggestions, and mock interview questions.

## 🛠️ Technology Stack
**Frontend:**
- React 19 & TypeScript
- Vite for fast bundling
- Tailwind CSS v4 & Framer Motion for styling and beautiful micro-animations
- Zustand for state management
- Clerk for secure authentication
- Monaco Editor for the coding playground

**Backend:**
- FastAPI & Python 3.10
- SQLite with SQLAlchemy ORM for data persistence (Chat History, User Profiles, Leaderboards)
- Google Gemini API (`gemini-3.5-flash`) for all advanced AI generation
- Python `subprocess` engine for secure code execution

## 🚀 Live Deployment
- **Frontend:** Hosted on [Vercel](https://skillforgeapp.vercel.app/)
- **Backend:** Hosted on [Render](https://skillforge-iasa.onrender.com)

---

## 💻 Local Development Setup

To run SkillForge locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Abhilash-ai/SkillForge.git
cd SkillForge
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Run the FastAPI server:
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder and add your Clerk Publishable Key:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```
Start the React development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser!

---
*Built with ❤️ by Abhilash-ai*
