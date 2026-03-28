---
description: This project uses multiple AI agents to build and manage the Gym Tracker feature in an Ionic Angular Utility App
---

# 🧠 Gym Tracker – Copilot Agents

This project uses multiple AI agents to build and manage the Gym Tracker feature in an Ionic Angular Utility App.

---

## 🎯 Goal
Build a Gym Tracker module that:
- Displays weekly workout plan (Mon–Sat)
- Allows tracking sets/reps
- Saves progress
- Shows weekly summary

---

## 🧩 Agents Overview

### 1. 🏗️ Planner Agent
**Role:** Break down requirements into tasks

**Responsibilities:**
- Convert workout plan into structured JSON
- Define feature scope
- Identify components, services, models
- Create task list for implementation

**Input:**
- Raw workout plan

**Output:**
- Task breakdown
- Data structure

---

### 2. 💻 Developer Agent
**Role:** Generate Ionic Angular code

**Responsibilities:**
- Create pages, components
- Implement UI using Ionic components
- Build service for state management
- Integrate storage (localStorage / Ionic Storage)

**Tech Stack:**
- Ionic + Angular
- TypeScript
- SCSS

**Output:**
- gym.page.ts/html/scss
- gym.service.ts
- models

---

### 3. 🎨 UI/UX Agent
**Role:** Improve design & usability

**Responsibilities:**
- Make UI clean and mobile-friendly
- Suggest layout improvements
- Ensure good spacing, colors, readability
- Add UX elements (progress bar, toggles)

---

### 4. 🧪 Tester Agent
**Role:** Validate functionality

**Responsibilities:**
- Test tracking logic
- Validate data persistence
- Check UI responsiveness
- Identify bugs

---

### 5. ⚡ Optimizer Agent
**Role:** Improve performance & structure

**Responsibilities:**
- Refactor code
- Optimize state management
- Reduce re-renders
- Improve scalability

---

## 🔄 Workflow Execution Order

1. Planner Agent → Creates structure
2. Developer Agent → Builds feature
3. UI/UX Agent → Enhances UI
4. Tester Agent → Validates
5. Optimizer Agent → Refines

---

## 📦 Output Expectation

- Fully working Gym Tracker module
- Clean UI
- Persistent data
- Modular and scalable code

---

## 🧠 Notes

- Follow Angular best practices
- Use reusable components
- Keep code readable and maintainable