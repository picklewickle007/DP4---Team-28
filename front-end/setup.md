# Frontend Setup Guide (React + Vite)

This is the **frontend** of your PSW Scheduling App.

---

## What You're Building

You are building the **user interface (UI)** of the app.

- The **backend (FastAPI)** handles data (tasks, history, etc.)
- The **frontend (React)** is what users see and interact with

Your job:  
Build pages that **talk to the backend** and display useful information.

---

## Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm (comes with Node)

Check installation:

```bash
node -v
npm -v
```

---

## Node, npm, and package.json (Important Concept)

If you followed the backend setup, you already saw:

- `venv` → isolates your Python environment  
- `pip` → installs packages  
- `requirements.txt` → lists dependencies  

The frontend has the **same idea**, just with different tools:

### Node.js
- Runs JavaScript outside the browser
- Equivalent to Python itself

### npm (Node Package Manager)
- Installs libraries (like React)
- Equivalent to `pip`

### package.json
- Lists all dependencies and scripts for your project
- Equivalent to `requirements.txt`

### Key Connection

| Backend (Python) | Frontend (JavaScript) |
|-----------------|----------------------|
| Python          | Node.js              |
| pip             | npm                  |
| venv            | node_modules (auto-managed) |
| requirements.txt| package.json         |

When you run:

```bash
npm install
```

You are doing the same thing as:

```bash
pip install -r requirements.txt
```

---

## Getting Started

From the `frontend/` directory:

```bash
npm install
npm run dev
```

You should see something like:

```
Local: http://localhost:5173/
```

Open that in your browser.

---

## Project Structure

Here’s what matters:

```
frontend/
├── src/
│   ├── App.jsx              # Main app + routing
│   ├── main.jsx             # Entry point
│   ├── pages/
│   │   └── patient/
│   │       ├── Home.jsx
│   │       ├── Schedule.jsx
│   │       ├── History.jsx
│   │       ├── Map.jsx
│   │       └── Settings.jsx
│   └── index.css            # Global styles
```
everything else isn't of importance to you!

---

## Routing (Important)

Your app uses React Router.

Inside `App.jsx`, you’ll see:

```jsx
<Route path="/patient/schedule" element={<PatientSchedule />} />
```

This means:
- Visiting `/patient/schedule` loads the `PatientSchedule` page

Try adding your own route later.

---

## Your First Task

Open:

```
src/pages/patient/Schedule.jsx
```

Right now it just says:

```jsx
<p>Student Work: Build the patient Schedule here.</p>
```

Replace it with something real:

```jsx
export default function PatientSchedule() {
  return (
    <div>
      <h1>Patient Schedule</h1>
      <ul>
        <li>Take medication</li>
        <li>Doctor appointment</li>
      </ul>
    </div>
  );
}
```

---

## Connecting to the Backend

Your backend is running on (open in a new terminal, navigate to the backend directory):

```
http://localhost:8000
```

Example endpoint:

```
GET /schedule
```

---

## Fetch Data Example

In `PatientSchedule.jsx`:

```jsx
import { useEffect, useState } from "react";

export default function PatientSchedule() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/schedule")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div>
      <h1>Patient Schedule</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.task}</li>
        ))}
      </ul>
    </div>
  );
}
```

This connects your frontend to the backend and displays real data.

---

## Things to Try

Experiment! Although I'm holding your hand thorugh this web dev, you should still do your best to be independent, and mess up until you learn what went wrong and what works!

### 1. Add a Task Input
- Create a form
- Send a `POST` request to `/schedule`

### 2. Build History Page
- Fetch from `/history`
- Display completed tasks

### 3. Improve UI
- Add buttons
- Add spacing and layout
- Improve styling

### 4. Handle Loading and Errors
- What happens before data loads?
- What if the backend is down?

---

## Mental Model

When building any page, think:

1. What data do I need?
2. Where does it come from? (API)
3. How do I store it? (`useState`)
4. When do I fetch it? (`useEffect`)
5. How do I display it?

---

## Common Errors

### Nothing showing up?
- Check browser console (CTRL + Shift + I / cmd + Shift + I)

### CORS issues?
- Backend should already allow all origins

### Fetch not working?
- Make sure the backend is running

---

If you get stuck, that is part of the process :). Have fun guys!