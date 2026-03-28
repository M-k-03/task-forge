---
description: This document defines how multiple AI agents collaborate to build the Task Forge application in a structured, scalable, and maintainable way using Ionic + Angular.
---

# 🚀 Agent Workflow - Task Forge (Ionic Application)

## 📌 Purpose

This document defines how multiple AI agents collaborate to build the Task Forge application in a structured, scalable, and maintainable way using Ionic + Angular.

---

## 🧠 Core Principle

* Separation of concerns
* Predictable execution
* Scalable architecture

Each agent has a **single responsibility** and must not overlap with others.

---

## 🏗️ Agents Overview

| Agent              | Responsibility            |
| ------------------ | ------------------------- |
| Orchestrator Agent | Planning & task breakdown |
| UI Agent           | Ionic UI development      |
| Feature Agent      | Business logic            |
| Data Agent         | Models & storage          |

---

## 🔄 End-to-End Workflow

### Step 1: Feature Input

* Read feature document from `/docs`
* Example:

  * water-tracker.md
  * gym-tracker.md

---

### Step 2: Orchestrator Agent (MANDATORY FIRST STEP)

#### Responsibilities:

* Analyze feature requirements
* Break feature into:

  * UI Tasks
  * Logic Tasks
  * Data Tasks

#### Output Format:

```
Feature: <Feature Name>

UI Tasks:
- Task 1
- Task 2

Logic Tasks:
- Task 1
- Task 2

Data Tasks:
- Task 1
- Task 2
```

#### Rules:

* Do NOT generate code
* Only planning and task structuring

---

### Step 3: UI Agent Execution

#### Input:

* UI Tasks from Orchestrator
* Design guidelines from `/docs`

#### Responsibilities:

* Build Ionic UI components using:

  * ion-header
  * ion-content
  * ion-card
  * ion-fab

#### Output:

* HTML templates
* SCSS / Tailwind styling

#### Constraints:

* No business logic
* Use mock/dummy data only

---

### Step 4: Feature Agent Execution

#### Input:

* Logic Tasks from Orchestrator

#### Responsibilities:

* Implement business logic
* Create reusable services

#### Output:

* Angular services (.ts files)
* Utility functions

#### Examples:

* calculateWaterIntake()
* calculateExpenses()
* generateWorkoutPlan()

#### Constraints:

* No UI code
* No direct data storage

---

### Step 5: Data Agent Execution

#### Input:

* Data Tasks from Orchestrator

#### Responsibilities:

* Define data models
* Implement storage layer

#### Output:

* TypeScript interfaces (models)
* Data services (CRUD operations)

#### Storage Options:

* LocalStorage (initial)
* IndexedDB (advanced)
* API-ready structure for future backend

#### Constraints:

* No UI
* No business logic

---

### Step 6: Integration Phase

#### Objective:

Combine outputs from all agents

#### Steps:

1. Connect UI with Feature services
2. Replace dummy data with real data
3. Inject Data services into Feature layer
4. Ensure end-to-end functionality

---

### Step 7: Validation Checklist

Before marking feature complete:

✅ UI matches design system
✅ Logic produces correct results
✅ Data persists correctly
✅ No responsibility overlap
✅ Code follows Ionic structure

---

## 📁 Standard Project Structure

```
/agents
  ├── orchestrator.agent.md
  ├── ui.agent.md
  ├── feature.agent.md
  ├── data.agent.md
  ├── agent-workflow.md

/docs
  ├── design.md
  ├── water-tracker.md
  ├── gym-tracker.md

/src/app
  ├── pages/
  ├── services/
  ├── models/
```

---

## ⚙️ Execution Order (STRICT)

1. Orchestrator Agent
2. UI Agent
3. Feature Agent
4. Data Agent
5. Integration

⚠️ Never skip or reorder steps

---

## 🔁 Iteration Workflow

If feature is incomplete:

1. Identify missing part
2. Re-run ONLY required agent
3. Update integration

---

## 🚫 Rules & Restrictions

* Agents must NOT overlap responsibilities
* No agent should generate full application code alone
* Orchestrator must always run first
* UI must not include logic
* Feature must not include UI
* Data must not include logic

---

## 📈 Scaling Strategy

Add new agents ONLY when necessary:

* Auth Agent → login/signup
* API Agent → backend integration
* AI Agent → recommendations/automation

Keep system minimal for performance.

---

## 🧩 Example Flow (Water Tracker)

1. Orchestrator:

   * Breaks feature into tasks

2. UI Agent:

   * Builds dashboard page

3. Feature Agent:

   * Creates water calculation service

4. Data Agent:

   * Defines WaterEntry model
   * Implements storage

5. Integration:

   * Connect UI → Service → Data

---

## 🎯 Final Goal

* Modular architecture
* Clean separation
* Fast development using AI agents
* Scalable Ionic application

---

## 🏁 Summary

This workflow ensures:

* Clear responsibilities
* Predictable outputs
* Easy debugging
* Scalable growth

Follow this strictly for best results.
