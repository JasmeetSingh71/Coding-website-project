🚀 CodeMentor AI – Full Stack Coding Platform with AI Assistance

CodeMentor AI is a full-stack coding and problem-solving platform where users can practice coding problems, submit code, view results, and interact with an AI chatbot for coding-related guidance.
Admins can upload coding questions, manage users, and add video solutions. The platform integrates Google Gemini AI for doubt-solving, offering real-time assistance while maintaining a focused, developer-oriented experience.

🧠 Key Features
👨‍💻 For Users

User registration and secure login using JWT Authentication

Access to coding problems with test cases and difficulty levels

Submit code and view evaluated results instantly

Integrated AI Chatbot (Gemini API) for coding-related queries only

Personalized dashboard with submission history

Responsive, modern UI built for smooth user experience

🛠️ For Admins

Admin panel for uploading coding questions and video solutions

Video storage and delivery through Cloudinary integration

Problem, user, and submission management system

⚙️ Tech Stack
💻 Frontend

React.js, Redux, React Router

Tailwind CSS, DaisyUI

Zod Resolver, Lucide React for validation & UI

Axios, Framer Motion for animations

⚙️ Backend

Node.js, Express.js

MongoDB with Mongoose for persistent data storage

Redis for token management and caching

JWT Authentication for security

Cloudinary for video storage

dotenv, bcrypt, Postman for configuration and testing

🧠 AI Integration

Google Gemini API – provides smart, coding-related assistance for users.
(Restricted to solve programming queries only, ensuring productivity and relevance.)

📂 Project Structure
CodeMentor-AI/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── ChatAi.jsx
│   │   │   ├── SubmissionHistory.jsx
│   │   ├── pages/
│   │   │   ├── Homepage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AdminPanel.jsx
│   │   ├── store/
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── index.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis.js
│   │   ├── controllers/
│   │   │   ├── aiChatting.js
│   │   │   ├── userProblem.js
│   │   │   ├── userSubmission.js
│   │   │   └── videoSection.js
│   │   ├── middleware/
│   │   │   ├── adminMiddleware.js
│   │   │   └── userMiddleware.js
│   │   ├── models/
│   │   │   ├── problem.js
│   │   │   ├── user.js
│   │   │   └── submission.js
│   │   ├── routes/
│   │   │   ├── userAuthentication.js
│   │   │   ├── problemCreate.js
│   │   │   ├── aiChatting.js
│   │   │   └── videoCreator.js
│   │   └── utils/
│   │       ├── validator.js
│   │       ├── problemUtils.js
│   │       └── index.js
│   └── package.json
│
└── README.md


⚡ Setup Instructions
🖥️ Backend Setup
cd backend
npm install
npm run dev


🌐 Frontend Setup
cd frontend
npm install
npm run dev

🌍 Deployment

🚧 Currently under local development. Hosting planned on Render / Vercel / Netlify.
The hosted link will be added soon.

🏆 Highlights

AI-powered interactive learning experience.

Scalable MERN architecture with Redis and JWT.

Advanced admin management with Cloudinary integration.

Clean modular code with reusable React components.

Create a `.env` file with the following:
DB_CONNECT_STRING=\ \
JWT_KEY=\ \
REDIS_PASS=\ \
GEMINI_KEY=\ \
CLOUDINARY_CLOUD_NAME = \ \
CLOUDINARY_API_KEY = \ \
CLOUDINARY_API_SECRET = \ \