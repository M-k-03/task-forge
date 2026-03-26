# 🛠️ TaskForge — Professional Ionic Utility App

**TaskForge** is a production-ready, modular mobile utility application built with **Ionic 8** and **Angular 20**. It provides a suite of essential tools designed with a focus on clean architecture, standalone components, and seamless user experience.

---

## 🚀 Key Features

### 🏋️‍♂️ 1. Gym Tracker (Modern PPL Split)
A comprehensive fitness tracking module featuring a **6-day Push/Pull/Legs (PPL) split** (Mon–Sat).
- **Interactive Tracking:** Per-set completion bubbles with visual feedback.
- **Progress Visualization:** Dynamic progress bars and workout segment switching.
- **Persistence:** Daily workout history saved to `localStorage` via a dedicated service.
- **Detailed Plan:** Pre-configured with essential strength and hypertrophy movements.

### 💧 2. Water Tracker
Track your weekly hydration and household water consumption.
- Record water can purchases and pricing.
- View history of past entries.
- Real-time calculation of total consumption.

### ⚖️ 3. BMI Calculator
A precise Body Mass Index calculator.
- Supports metric inputs and provides immediate health classifications.
- Persistent history of previous calculations to track health trends.

### 💰 4. Expense Tracker
Manage your daily finances on the go.
- Categories for different spend types.
- Visual history of expenses with currency formatting.

### 📝 5. Notes
A simple yet powerful scratchpad for your thoughts.
- Quick entry for text notes.
- Persistent storage for your records.

---

## 🏗️ Architecture & Tech Stack

TaskForge follows modern Angular best practices to ensure scalability and maintainability.

- **Frontend Framework:** `Ionic Framework v8` (Angular Standalone Components)
- **Language:** `TypeScript 5.x`
- **Styling:** `SCSS` with CSS Variables for theming.
- **State Management:** Service-based state with `BehaviorSubject` and `RxJS`.
- **Persistence:** High-level `StorageService` managing a structured `localStorage` registry.
- **Data Loading:** Asynchronous loading of workout plans via `HttpClient`.

### 📂 Directory Structure
```
src/app/
├── core/             # Centralized services (Storage, Constants)
├── shared/           # Reusable components and pipes
├── features/         # Self-contained feature modules
│   ├── gym-tracker/  # Planning, development, testing models
│   ├── water-tracker/
│   ├── bmi-calculator/
│   ├── expense-tracker/
│   └── notes/
└── home/             # Main dashboard
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js:** Version 18+ recommended.
- **Ionic CLI:** `npm install -g @ionic/cli`

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/M-k-03/task-forge.git
    cd task-forge/utility-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run start
    ```

---

## 🤖 AI Development Workflow
This project utilizes a structured **Multi-Agent Workflow** for rapid development:
- **Planner Agent:** Requirements analysis and task decomposition.
- **Developer Agent:** High-quality component and service implementation.
- **UI/UX Agent:** Design polishing and animations.
- **Tester Agent:** Functionality verification and bug fixing.
- **Optimizer Agent:** Code refactoring and performance tuning.

---

## 📄 License
This project is open-source under the MIT License.
