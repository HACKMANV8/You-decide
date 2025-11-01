# 🛡️ Log Lens

**Log Lens** is a centralized, AI-driven cybersecurity log analysis and monitoring system designed for **CRPF units and offices deployed across India**.  
It provides a **secure, scalable, and tamper-proof** platform for collecting, analyzing, and visualizing system logs — ensuring **real-time threat detection, blockchain-backed log integrity, and expert-assisted incident response.**

---

## 🚨 Problem Statement

Currently, CRPF’s IT systems and offices are deployed across multiple remote and urban locations.  
There is **no centralized mechanism** for experts to:
- Collect and analyze system logs from distributed systems.
- Detect cyber threats, breaches, or anomalies in real-time.
- Ensure that collected logs are **tamper-proof** and **verifiable**.

This makes it difficult to perform **threat assessment**, **audit investigations**, and **incident response** efficiently.

---

## 💡 Proposed Solution

**Cyber Sentinel** provides a **centralized log monitoring and analytics system** that:
- Aggregates logs from all CRPF units into one secure hub.
- Uses **AI and ML models** to detect anomalies and suspicious activity.
- Records key alerts on **blockchain** for immutability and verification.
- Provides a **dashboard** for cybersecurity experts to visualize, analyze, and respond to threats in real-time.

---

## 🔑 Key Features

### 🧠 AI-Driven Threat Detection
- Machine Learning models identify **anomalies**, **malicious access**, and **pattern-based attacks**.
- Supports both **rule-based** and **unsupervised ML** approaches.

### 🕵️ Blockchain-Backed Log Integrity
- Critical log hashes and alerts are recorded using **Ethereum smart contracts** via **Truffle** and **Moralis**.
- Ensures logs are **tamper-proof**, **verifiable**, and **securely auditable**.

### 🌐 Centralized Log Aggregation
- Collects IT logs from multiple distributed CRPF units.
- Maintains uniform **timestamp synchronization** using **Luxon** for accurate event correlation.

### 📊 Interactive Monitoring Dashboard
- Built using **Next.js + Tailwind CSS**, providing a real-time, intuitive SOC (Security Operations Center) dashboard.
- Displays **graphs, alerts, and statistics** with **Recharts/Chart.js**.

### 🔒 Secure User Management
- Implements **Role-Based Access Control (RBAC)** for CRPF experts and admins.
- Supports **secure authentication**, **encryption**, and **session control**.

### ☁️ Scalable Deployment
- Containerized using **Docker**, ready for deployment on secure CRPF or government cloud infrastructure.
- Supports integration with **Prometheus** and **Grafana** for system monitoring.

---

## 🧰 Tech Stack

| Layer | Technologies Used | Description |
|-------|-------------------|--------------|
| **Frontend** | Next.js, Tailwind CSS, Recharts, Luxon | Interactive UI for CRPF experts with live analytics and consistent timestamps. |
| **Backend** | Node.js (Express), Python (Flask/FastAPI) | API gateway for log collection, ML inference, and alert distribution. |
| **Database** | MongoDB | Stores log data, alerts, and user information. |
| **Blockchain Layer** | Truffle, Solidity, Moralis, Web3.js | Records event hashes on Ethereum for immutable verification. |
| **AI/ML** | Python, Scikit-learn, Pandas, Numpy | Detects anomalies and potential breaches in incoming logs. |
| **Security** | Crypto.js, Bcrypt, JWT | Encrypts sensitive data, authenticates users, and ensures data confidentiality. |
| **Deployment** | Docker, Nginx | Simplifies deployment and scales horizontally and we are working to make it vertically. |

---

## ⚙️ Architecture Overview

```text
   [CRPF Local Systems]
          │
          ▼
   ┌────────────────────┐
   │  Log Collector API  │  ← Node.js Backend
   └────────────────────┘
          │
          ▼
   ┌────────────────────┐
   │  ML Engine (Python)│  ← Detects anomalies
   └────────────────────┘
          │
          ▼
   ┌────────────────────┐
   │  MongoDB Database  │  ← Stores logs & alerts
   └────────────────────┘
          │
          ├──→ Blockchain (Truffle + Moralis)  
          │        └─ Stores immutable hashes of key alerts
          ▼
   ┌────────────────────┐
   │ Next.js Dashboard  │  ← CRPF Expert View
   └────────────────────┘

