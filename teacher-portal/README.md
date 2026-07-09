# HealthQuest — Teacher Web Portal

This is the dedicated web portal for teachers to upload videos, create lessons, categorize content by grade and topic, and track student progress. It connects directly to your existing Firebase Firestore database and Firebase Storage bucket.

## Prerequisites

1. **Node.js**: Ensure you have Node.js 18+ installed on your computer.
2. **Firebase Rules**: Make sure your Firestore database rules permit authenticated users to read and write data.

---

## Getting Started

Follow these steps to run the Teacher Portal locally:

### 1. Install Dependencies
Navigate into the `teacher-portal` directory and install the packages:
```bash
cd teacher-portal
npm install
```

### 2. Configure Environment Variables
A `.env` file has already been created for you inside the `teacher-portal` directory. It uses your active Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=healthquest-63383...
...
```

### 3. Run the Development Server
Launch the local dev server:
```bash
npm run dev
```

The portal will start running at:
👉 **http://localhost:5173** (or the next available port)

---

## Production Deployment

To build a optimized standalone production bundle of the portal:
```bash
npm run build
```

This will output static files into the `dist/` directory, which can be hosted for free on **Firebase Hosting**, GitHub Pages, Vercel, or Netlify.
