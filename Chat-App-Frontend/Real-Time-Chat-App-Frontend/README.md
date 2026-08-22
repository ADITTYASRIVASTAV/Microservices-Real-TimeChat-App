# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

Terminal me ye command chala kar check kar lijiye ki saare containers running hain ya nahi:

bash
docker compose ps
Agar containers stop hain, toh sabhi services ko ek saath start karne ke liye ye command chalayein:

bash
docker compose up -d
Command chala lijiye, phir mujhe bataiye jab saare containers Up / Running ho jaayein! 





==============================================================
 data base ko delete krne ka tarika with heklp of docker 
=============================================================
E:\JavaFullStackProject\Real-Time-Chat-Application>docker exec -it user-db psql -U postgres -d User-Services-DB -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
ERROR:  relation "users" does not exist

What's next:
    Try Docker Debug for seamless, persistent debugging tools in any container or image → docker debug user-db
    Learn more at https://docs.docker.com/go/debug-cli/

E:\JavaFullStackProject\Real-Time-Chat-Application>
why this show 
The error ERROR: relation "users" does not exist occurred because in PostgreSQL, the table in user-db is named differently (e.g. user_profile, user_profiles, or users_table) instead of users.

🔍 Step 1: See exact table names in user-db
Run this command in PowerShell to list all tables in User-Services-DB:

powershell
docker exec -it user-db psql -U postgres -d User-Services-DB -c "\dt"
Also check tables in auth-db:

powershell
docker exec -it auth-db psql -U postgres -d Auth-service-DB -c "\dt"
🗑️ Step 2: Delete data based on actual table names
Once you run \dt, you will see your table names.

If the table name in user-db is user_profile or user_profiles, run:

powershell
docker exec -it user-db psql -U postgres -d User-Services-DB -c "TRUNCATE TABLE user_profile RESTART IDENTITY CASCADE;"
(Or replace user_profile with the table name listed by \dt).

⚡ Quick Alternative (Wipe & Re-create clean DBs):
If you want to clear all data from all databases in 1 second, run:

powershell
cd E:\JavaFullStackProject\Real-Time-Chat-Application
docker-compose down -v
docker-compose up -d








===========================
see log in backend 
========================

if i want to see backend response/log  when fronted requestthrough docker then what i do 
Here are the 3 best ways to view live backend logs and HTTP responses in Docker:

💻 Option 1: Live Terminal Logs (Most Popular)
Run these PowerShell commands in your terminal:

1. See live logs for ALL microservices at once:
powershell
cd E:\JavaFullStackProject\Real-Time-Chat-Application
docker compose logs -f
2. See live logs for a specific service:
Auth Service (Login / Register / OTP logs):

powershell
docker compose logs -f auth-service
API Gateway (HTTP routing logs):

powershell
docker compose logs -f api-gateway
Chat Service (WebSocket / Messaging logs):

powershell
docker compose logs -f chat-service
(Press Ctrl + C anytime to stop viewing logs).

🌐 Option 2: Spring Boot Admin Dashboard (Visual GUI)
Open your browser to: 👉 http://localhost:8090

Username: admin
Password: admin123
Click on auth-service or chat-service.
Click on the "Logfile" tab to view real-time formatted application logs directly in your browser!
🕵️ Option 3: Zipkin Distributed Tracing
Open your browser to: 👉 http://localhost:9411

Click "Run Query" to view a visual waterfall diagram of every HTTP request flowing from api-gateway -> auth-service -> auth-db!

========================================
KAFKA MASSAGE TRAVEL  COMMAND

>docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:29092 --topic message-topic --from-beginning

=====================================



===========================================================================================

If you are running all Java Spring Boot microservices inside IntelliJ IDEA, then Docker only needs to run the Infrastructure Services (PostgreSQL Databases + Kafka & Zookeeper).

1. Command to Run Infrastructure Only in Docker (Recommended when using IntelliJ IDEA):
Open PowerShell / Terminal in your backend root folder (e:\JavaFullStackProject\Real-Time-Chat-Application) and run:

powershell
docker-compose up -d zookeeper kafka auth-db user-db chat-db notification-db
2. Why Run Only Infrastructure in Docker?
Container	Port	Purpose
zookeeper	2181	Manages Kafka Cluster state
kafka	9092 / 29092	Real-Time Events (Presence, Read Receipts, Notifications)
auth-db	5432	PostgreSQL for Auth-service
user-db	5433	PostgreSQL for User-Services
chat-db	5434	PostgreSQL for chat-services
notification-db	5435	PostgreSQL for Notification-Service
3. Workflow Summary:
Step 1 (Docker): Start databases & Kafka:
powershell
docker-compose up -d zookeeper kafka auth-db user-db chat-db notification-db
Step 2 (IntelliJ IDEA): Start your Spring Boot services in this order:
EurekaServerApplication (Port 8761)
ApiGatewayApplication (Port 8080)
AuthServiceApplication (Port 8083)
UserServicesApplication (Port 8082)
ChatServicesApplication (Port 8081)
NotificationServiceApplication (Port 8084)
Step 3 (Frontend): Start React dev server:
powershell
npm run dev
4. (Optional) Command to Stop Docker Containers when done:
powershell
docker-compose down