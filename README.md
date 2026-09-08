# 💰 Expense Tracker

### A modern full-stack personal finance management application

> **Track your money. Understand your spending. Take control of your finances.**

A full-stack expense management application built with **React, Django REST Framework, and Firebase Firestore**. The application allows users to securely manage income and expenses, organize transactions by category, visualize spending patterns, and manage their account through a complete authentication and password-reset workflow.

<p align="center">
  <a href="https://expense-tracker-three-umber-87.vercel.app">
    <strong>🚀 Live Demo</strong>
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-features">
    <strong>✨ Features</strong>
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#-technology-stack">
    <strong>🛠️ Tech Stack</strong>
  </a>
</p>

---

## 📸 Preview

<p align="center">
  <img src="./frontend/src/assets/projects/expense-tracker.png" alt="Expense Tracker Preview" width="850"/>
</p>

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Secure token-based authentication
* Logout functionality
* Password reset through email
* Password reset links with expiration
* Protected application routes

### 💳 Transaction Management

* Add income and expenses
* Categorize transactions
* Add descriptions and transaction dates
* View transaction history
* Manage personal financial records

### 📊 Dashboard

* Total income
* Total expenses
* Current balance
* Category-wise expense breakdown
* Recent transactions

### 📈 Analytics

* Visualize spending patterns
* Analyze expenses by category
* Understand where money is being spent
* Interactive financial insights

### 👤 Profile

* View account information
* Manage user-related information
* Personalized expense tracking

### 📱 Responsive UI

* Modern dashboard interface
* Responsive layout
* Clean navigation
* Designed for desktop and mobile experiences

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React + Vite   │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Django REST         │
                    │ Framework           │
                    │ Backend             │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             Firebase Firestore       Brevo
                Database            Email Service
```

---

## 🛠️ Technology Stack

| Layer             | Technology                    |
| ----------------- | ----------------------------- |
| Frontend          | React.js + Vite               |
| Styling           | CSS                           |
| API Communication | Axios                         |
| Backend           | Python + Django               |
| API               | Django REST Framework         |
| Database          | Firebase Firestore            |
| Authentication    | Django REST Authentication    |
| Email             | Brevo Transactional Email API |
| Deployment        | Vercel + Render               |
| Version Control   | Git + GitHub                  |

---

## 🔑 Key Technical Highlights

### Full-Stack Integration

The frontend communicates with a Django REST API using Axios, allowing the application to maintain a clean separation between the presentation layer and backend business logic.

### Firebase Firestore

Financial data is stored in **Firebase Firestore**, providing a scalable cloud-based NoSQL database for user and transaction data.

### Secure Password Recovery

The application implements a complete password recovery workflow:

```text
User enters email
       ↓
Django verifies account
       ↓
Secure reset token generated
       ↓
Brevo sends reset email
       ↓
User opens reset link
       ↓
New password submitted
       ↓
Password updated
```

Reset links are time-limited to improve account security.

### RESTful API

The backend exposes dedicated API endpoints for:

```text
/api/login/
/api/register/
/api/transactions/
/api/categories/
/api/dashboard/
/api/forgot-credentials/
/api/reset-password/
```

---

## 📂 Project Structure

```text
expense-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── firebase.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── build.sh
│
└── README.md
```

---

## 🚀 Live Application

### 🌐 Frontend

**Expense Tracker:**
https://expense-tracker-three-umber-87.vercel.app

### ⚙️ Backend API

**Django Backend:**
https://expense-tracker-back-4143.onrender.com

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd expense-tracker
```

### 2. Start the backend

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🔒 Environment Variables

For security, sensitive credentials are stored using environment variables and are **not committed to GitHub**.

Example:

```env
DJANGO_SECRET_KEY=your_secret_key

FIREBASE_CREDENTIALS=your_firebase_credentials

BREVO_API_KEY=your_brevo_api_key

EMAIL_FROM=your_verified_email
```

> ⚠️ Never commit API keys, Firebase service-account credentials, passwords, or other secrets to GitHub.

---

## ☁️ Deployment

The project is deployed using a modern frontend/backend architecture:

```text
GitHub
   │
   ├──────────────► Vercel
   │                  │
   │                  ▼
   │              React Frontend
   │
   └──────────────► Render
                      │
                      ▼
                Django REST API
                      │
                      ▼
                Firebase Firestore
```

---

## 🎯 What I Built

This project demonstrates practical experience with:

* Full-stack application development
* REST API development
* React component architecture
* Django backend development
* Firebase cloud database integration
* Authentication and authorization
* Email-based password recovery
* API integration
* Cloud deployment
* Environment variable management
* Git and GitHub workflow
* Frontend/backend separation

---

## 📌 Future Improvements

* Monthly and yearly financial reports
* Budget planning
* Export transactions as CSV/PDF
* Advanced financial analytics
* Recurring transactions
* Expense notifications
* Dark/light theme improvements
* Progressive Web App support

---

## 👨‍💻 Developer

### Mathivishnu S

**Full Stack Python Developer**

B.Tech — Information Science & Engineering

Interested in building scalable, user-focused web applications using **Python, Django, React, and modern cloud technologies**.

<p>
  <a href="https://github.com/Rxmathi143">
    GitHub
  </a>
</p>

---

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐.

**Thanks for checking out Expense Tracker!**
