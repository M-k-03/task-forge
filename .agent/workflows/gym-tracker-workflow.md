---
description: Gym Tracker Workflow (Copilot Agents)
---

# 🔄 Gym Tracker Workflow (Copilot Agents)

---

## 🚀 Step 1: Planning Phase

**Agent:** Planner Agent

### Prompt:
Analyze the given workout plan and:
- Convert it into structured JSON
- Identify components needed
- Define data model
- Create task breakdown

### Output:
- workout.json
- component list
- development tasks

---

## 🏗️ Step 2: Development Phase

**Agent:** Developer Agent

### Prompt:
Using the plan:
- Create Ionic Angular page (Gym Tracker)
- Build UI with:
  - Day selector (Mon–Sat)
  - Exercise list
  - Checkbox for completion
  - Input for sets/reps
- Create service for:
  - Saving progress
  - Fetching workout data

### Output:
- gym.page.ts/html/scss
- gym.service.ts
- workout.model.ts

---

## 🎨 Step 3: UI Enhancement

**Agent:** UI/UX Agent

### Prompt:
Improve UI:
- Add progress bar
- Use clean card layout
- Improve spacing and typography
- Add toggle (Plan vs Progress view)

### Output:
- Updated UI code

---

## 🧪 Step 4: Testing

**Agent:** Tester Agent

### Prompt:
Test:
- Saving/loading progress
- Checkbox functionality
- Data persistence
- UI responsiveness

### Output:
- Bug list
- Fix suggestions

---

## ⚡ Step 5: Optimization

**Agent:** Optimizer Agent

### Prompt:
- Refactor code
- Improve performance
- Optimize storage usage
- Ensure scalability

### Output:
- Optimized code

---

## ✅ Final Deliverable

- Fully functional Gym Tracker
- Weekly tracking system
- Clean UI + persistent storage

---

## 🔁 Optional Extensions

- Add analytics (weekly stats)
- Add reminders
- Add diet tracking integration