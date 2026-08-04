# 💼 AI Resume & ATS Optimizer Dashboard

A full-stack, distributed microservice architecture that analyzes technical job requirements, extracts critical missing keywords, and scores profile alignment metrics using artificial intelligence. To eliminate redundant AI processing delays and save cloud API costs, the system implements an internal, relational database caching engine.

---

## 🏗️ System Architecture & Data Flow

The application is structured as a standalone **Monorepo** consisting of three decoupled layers communicating over structured network boundaries:

```text
[React Frontend] (TypeScript / Mantine v7)
       │  ▲
       │  │ (REST / JSON)
       ▼  │
[Backend Gateway API] (Java 25 / Spring Boot 4) ◄───► [SQL Cache] (Embedded Local H2 DB)
       │  ▲
       │  │ (REST / JSON)
       ▼  │
[AI Generation Microservice] (Python 3.12 / FastAPI) ───► [Google Gemini 3.6 Flash]
```

### 🔄 The Caching Lifecycle:
1. **User Request**: The candidate inputs a target job title via the smart Mantine Autocomplete dashboard.
2. **Java Interception**: The custom `JobProfileController` queries the relational database cache layer using case-insensitive SQL matching rules (`jobProfileRepository.findByJobTitleIgnoreCase()`).
3. **Cache Hit ✅**: If the job title profile has been previously evaluated, Java returns the record in **single-digit milliseconds**, bypassing Python and the Gemini cloud API completely.
4. **Cache Miss ❌**: If the profile is missing, Java issues an internal HTTP request to the Python microservice.
5. **Structured AI Extraction**: Python routes the request to the Google Gemini 3.6 Flash engine using strict **Structured Outputs JSON Schemas** to ensure predictable data formatting.
6. **Persistence**: Python hands the structured object back to Java. The gateway maps the properties, executes fail-safe `Long` parsing procedures, saves the record to the SQL table layout (`jobProfileRepository.save()`), and pushes the payload to React.

---

## 🗺️ System Development Roadmap

To systematically transition this prototype from an advanced local sandbox into an elite, enterprise-grade cloud asset, development is executed along a strict 4-phase milestone path:

### 🟩 Phase 1: Interactive Skill Checklist (Completed ✅)
* **Goal:** Transform static informational keyword displays into interactive UI action components.
* **Execution:** Migrate standard Mantine `Badge` displays to self-contained dynamic `Chip` matrices. Build React string-array state filters allowing users to physically check off keywords as they tailormake their experience bullets, smoothly morphing the UI from an orange warning alert into a green milestone.

### 🟨 Phase 2: Historical Search Dashboard Analytics (In Progress 🛠️)
* **Goal:** Shift from single-card rendering views into a comprehensive career overview matrix.
* **Execution:** Create an independent "Analytics Hub" view tab leveraging the core Java `/cached` list data stream array. Build custom layout rows that present all past lookups side-by-side, automatically sorting queries from highest compatibility to lowest so candidates can instantly spot where they align best.

### 🟧 Phase 3: Live File Upload Processing (Deep AI Integration)
* **Goal:** Upgrade the intelligence core from general market analysis to hyper-personalized profile parsing.
* **Execution:** Integrate an advanced frontend file stream pad using Mantine's `<Dropzone>` module. Candidates drag and drop their raw `resume.pdf` or `resume.txt` file, allowing React to capture the file buffers and pass dual payloads (`jobTitle` + `resumeText`) across the Java bridge. Refactor Gemini's system instructions to run a defensive cross-examination between the candidate's exact phrasing and standard compliance metrics.

### 🟥 Phase 4: Serverless Cloud Production Deployment
* **Goal:** Migrate local background loop pipelines onto globally accessible web hosting servers.
* **Execution:** Deploy the React view layers to **Vercel** or **Netlify** with native GitHub CI/CD hookups. Deploy the Python FastAPI and Java Spring Boot engines to highly scalable containers on **Render** or **Railway**. Provision an external serverless **Neon Cloud PostgreSQL** database cluster, swapping our embedded H2 settings for permanent, multi-tenant cloud storage engines.

---

## 🛠️ Tech Stack & Core Infrastructure

### 🎨 Frontend (React App)
* **Language Framework:** TypeScript
* **Design Engine:** Mantine UI Components (v7)
* **Key Features:** Smart local search history autocomplete tracking, conditional color-coded metric badges, and interactive string array splitting for individual text keyword tags.

### ☕ Middleware Layer (Core Gateway)
* **Language & Runtime:** Java 25 (OpenJDK)
* **Framework:** Spring Boot 4.x
* **Data Mapping:** Spring Data JPA / Hibernate 6 ORM
* **Custom Architecture:** Centralized SLF4J logger interceptors, custom package namespaces (`com.resumematcher.api`), and robust generic `safeParseLong` utility mapping.

### 🐍 AI Microservice (Core Intelligence)
* **Language Framework:** Python 3.12+
* **Environment Manager:** `uv` high-performance package manager
* **Web Server:** FastAPI / Uvicorn Server Engine
* **AI SDK:** Native `google-genai` integration with fine-tuned temperature parameters for predictable recruitment analysis.

### 🗄️ Database Tier (Development Cache)
* **Engine:** Relational H2 Database Engine
* **Configuration:** Embedded development mode memory blocks
* **Persistence:** Automated structural schema updates mapping directly to the `JobProfile` entity.

---

## 🚀 Quick Start & Installation

To run this project locally on your machine, launch the execution scripts across three open terminal windows:

### 1. Launch the AI Microservice (Python)
Navigate to your Python directory, supply your private `.env` file credentials, and start the runtime wrapper:
```bash
cd ai-service
# Ensure a .env file containing GEMINI_API_KEY=your_secret_key is in this directory
uv add python-dotenv google-genai fastapi uvicorn
uv run uvicorn main:app --reload --port 8000
```

### 2. Launch the Gateway Application (Java)
Navigate to the backend system directory, run a clean workspace check, and boot the Spring Boot environment:
```bash
cd java-backend
./mvnw clean spring-boot:run
```

### 3. Launch the Dashboard Client (React)
Navigate to the frontend workspace folder, compile the dependency tree, and spin up the development viewport:
```bash
cd react-frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** inside your web browser.

---

## 🔒 Security & Versioning Control
The master root `.gitignore` parameters protect system secrets. Private environment properties (`.env`), temporary compiler build binaries (`target/`), auto-downloaded node dependencies (`node_modules/`), and bulky runtime platform modules (`*Jdk*/`) are explicitly stripped from tracking logs to maintain codebase lightness and prevent token leakage.
