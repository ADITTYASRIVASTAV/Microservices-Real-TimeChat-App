
About The Project

ChatApp is a full‑featured real‑time messaging platform inspired by WhatsApp. It provides secure one‑to‑one and group chats, end‑to‑end encryption, real‑time presence, read receipts, and push notifications — all built on a scalable microservices architecture.

Why was it built?
This project demonstrates production‑grade full‑stack development skills, including microservices design, event‑driven communication, real‑time WebSocket handling, OAuth2 authentication, and modern frontend engineering.

Who can use it?
Developers learning microservices, startups requiring a chat backend, or anyone looking for a robust real‑time messaging template.

===============
 Features
===============
 Authentication

✅ User Registration with Email OTP Verification

✅ Login with JWT (24h access + refresh tokens)

✅ Google OAuth2 Login

✅ Forgot Password with Email Reset Link

✅ BCrypt Password Hashing (strength 10)

==================
 Messaging
==================
✅ Real‑time 1‑to‑1 Chat via WebSocket

✅ Message Read Receipts (✓ Sent, ✓✓ Delivered, 🔵✓✓ Read)

✅ Typing Indicators (optional)

✅ Chat History with Pagination

=============
 Groups
=============
✅ Create / Join / Leave Groups

✅ Admin & Member Roles

✅ Group Messaging with WebSocket

✅ Group Search

====================
 Notifications
====================
✅ Real‑time Push Notifications

✅ Unread Badge Count per Chat / Group

✅ In‑app Notification List

====================
 Security
====================
✅ End‑to‑End Encryption (RSA 2048‑bit)

✅ JWT Validation at API Gateway

✅ WebSocket JWT Authentication

✅ CORS Protection

=======================
 Real‑time Presence
======================

✅ Online / Offline Status

✅ Last Seen Timestamp

====================
 Frontend
====================
✅ Mobile Responsive Design

✅ Dark Mode Support

✅ Smooth Animations with Framer Motion


==================
Tech Stack
==================

============
Backend
===========
Category	                           Technology
Language	                             Java 21
Framework	                             Spring Boot 4+
Cloud	                               Spring Cloud 2023.0.3
Build Tool	                                    Maven
Architecture 	                            Microservices
Service Discovery	                      Netflix Eureka Server
API Gateway	                                Spring Cloud Gateway
Security	                            Spring Security, JWT, OAuth2
Database	                             PostgreSQL (4 databases)
ORM	Spring Data JPA,                            Hibernate
Messaging	                         Apache Kafka (5 topics)
Real‑time	WebSocket,                         STOMP, SockJS
Monitoring	Spring Boot Admin,                Sleuth, Zipkin
Containerization	Docker,                 Docker Compose (14 containers)



========================
Frontend
=======================
Category	                                         Technology
Framework	                                          React 18
Language	                                           TypeScript
Build Tool                                              	Vite
Styling	                                              TailwindCSS
UI Library	                                            ShadCN UI
State Management	                               Redux ToolkitRouting	React Router DOM v6
Animation	                                           Framer Motion
HTTP Client	                                                 Axios
WebSocket	                                        SockJS + @stomp/stompjs
JWT Decoding	                                            jwt-decode
Encryption	Web                                            Crypto API (RSA)
Toast	                                                      Sonner
Icons	                                                     Lucide React


======================
High‑Level Diagram
=======================

                          
                              React Frontend  
                                     ┬
                                     │ HTTP / WebSocket
                                     ▼
                                 API Gateway       Port 8080
                            (JWT Validation) 

                                     │
                     ┌             ──────
                     │               │                │
                     ▼               ▼                ▼
          
                Auth Service   User Service │ │  Chat Service │
             │  Port 8081      │  Port 8082    │ │  Port 8083    │
            
                    │                │                │
                 
                                    │
                                    ▼
                        
                          │   Eureka Server      │  Port 8761
                         

                          ┌─────────────────────┐
                          │  Kafka (5 Topics)    │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │ Notification Service │  Port 8084
                          └─────────────────────┘

                          ┌─────────────────────┐
                          │   Admin Server       │  Port 8090
                          └─────────────────────┘

        PostgreSQL DBs: auth_db, user_db, chat_db, notification_db

=================================



=======================
Microservices Summary



Service	Port Purpose	Database
eureka-server	8761	Service Registry	-
api-gateway	8080	Entry point, JWT, routing, CORS	-
auth-service	8081	Registration, Login, OTP, OAuth2	auth_db
user-service	8082	Profiles, Presence, Last Seen	user_db
chat-service	8083	1‑to‑1 & Group chat, WebSocket, E2EE	chat_db
notification-service	8084	Kafka consumer, Push notifications	notification_db
admin-server	8090	Monitoring Dashboard	-



======================
Installation & Setup
======================
1. Clone the repository
bash
git clone https://github.com/adityaraj/chatapp.git
cd chatapp
2. Backend Setup
Using Docker (Recommended)
bash
cd chat-app-backend
docker compose up --build -d
This will start all 14 containers automatically in the correct order.

Manual Setup (Without Docker)
Start PostgreSQL databases (4 instances) or modify application.properties to point to existing databases.

Start Kafka & Zookeeper locally or use Docker for Kafka.

Start each microservice in the following order:

eureka-server
admin-server (optional)
api-gateway
auth-service
user-service
chat-service
notification-service


=================
. Frontend Setup
==================
bash
cd chat-app-frontend
npm install
npm run dev


 License
Distributed under the MIT License. See LICENSE for more information.
