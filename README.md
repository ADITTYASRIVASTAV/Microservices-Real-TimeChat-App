
================================================================================================
                           Real-Time Chat Application
 ================================================================================================                          

A full-stack Real-Time Chat Application built with a Microservices Architecture, providing secure authentication, real-time 1-to-1 and group messaging, client-side End-to-End Encryption (E2EE), online/offline presence, notifications, unread message counts, and asynchronous event processing.

The application is designed to demonstrate how modern distributed systems can combine Spring Boot Microservices, WebSockets, Apache Kafka, PostgreSQL, React, and client-side encryption to build a scalable real-time communication platform.



                ====================================       
                    1.    Key Highlights
                ====================================

Microservices-based backend architecture
Real-time 1-to-1 messaging
Real-time group chat
Client-side End-to-End Encryption (E2EE)
JWT Access Token and Refresh Token authentication
OAuth2 login with Google and GitHub
Email-based OTP verification for password reset
STOMP WebSocket communication with SockJS
Online/Offline presence tracking
Read receipts
Push notifications
Unread message counters
Apache Kafka asynchronous event processing
Database-per-service architecture
Service discovery with Eureka
Centralized API routing with Spring Cloud Gateway
Spring Boot Admin and Actuator monitoring
Distributed tracing with Zipkin
Docker and Docker Compose infrastructure


================================================================================================
                           ┌───────────────┐
                           │     USER      │
                           └───────┬───────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │ React + TypeScript UI    │
                    │ Redux + WebSocket + E2EE │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       API GATEWAY        │
                    │        Port 8080         │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │      EUREKA SERVER       │
                    │        Port 8761         │
                    └──────────────────────────┘

      ┌──────────────┬──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
│   AUTH   │   │   USER   │   │   CHAT   │   │ NOTIFICATION │
│   8081   │   │   8082   │   │   8083   │   │     8084     │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └──────┬───────┘
     │              │              │                │
     ▼              ▼              ▼                ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
│ Auth DB  │   │ User DB  │   │ Chat DB  │   │Notification DB│
│   5432   │   │   5433   │   │   5434   │   │     5435     │
└──────────┘   └──────────┘   └──────────┘   └──────────────┘

                        ┌────────────────┐
                        │  Apache Kafka  │
                        │   + Zookeeper  │
                        └────────────────┘


=================================================================================================
                                
                                
                             ====    BACKEND   =====

                       =========================================
                              2. System Components
                       =========================================


1. Eureka Server — Service Discovery  Port: 8761
===============================================

Eureka acts as the central service registry.

When a microservice starts,
 it registers itself with Eureka. Other services and ,the API Gateway can discover available service instances dynamically instead of using hardcoded service URLs.

Responsibilities
Microservice registration
Service discovery
Dynamic service lookup    



2. API Gateway — Central Entry Point Port: 8080
===================================================

The API Gateway acts as the main entry point for frontend REST API requests.

 ==> Responsibilities

JWT validation
CORS handling
Request routing
Dynamic service discovery through Eureka

Example Routes
/api/auth/**           → Auth Service
/api/users/**          → User Service
/api/chat/**           → Chat Service
/api/groups/**         → Chat Service
/api/notifications/**  → Notification Service

The gateway discovers service instances dynamically using:
lb://Auth Service
lb://User Service
lb://Chat Service
lb://Notification Service


3. Auth Service — Authentication & Security  Port: 8081
===========================================================

The Auth Service manages authentication and user security.

 ==> Features

User registration
Login
JWT Access Tokens
Refresh Tokens
OAuth2 authentication
Google login
GitHub login
Email OTP verification
Password reset
Main Components

Config/
├── SecurityConfig.java
├── PasswordEncoderConfig.java
└── OAuth2SuccessHandler.java
Controller/
└── AuthController.java
Entity/
├── User.java
├── Token.java
└── Otp.java
Repository/
├── UserRepository.java
├── TokenRepository.java
└── OtpRepository.java
Security/
└── CustomUserDetailsService.java
Service/
├── AuthService.java
└── JwtService.java


4. User Service — Profiles, Presence & Blocking  Port: 8082
===============================================================

The User Service manages user-related information.

==> Features

User profile management
Avatar
Phone number
Bio
Online/Offline status
User blocking
User unblocking

When a user's presence changes, the service publishes a presence event to Apache Kafka.

Main Components
Controller/
├── UserProfileController.java
├── UserPresenceController.java
└── BlockUserController.java
Entity/
├── UserProfile.java
├── UserPresence.java
└── BlockedUser.java
Service/
├── UserProfileService.java
└── UserPresenceService.java
Kafka/
└── PresenceEventProducer.java


5. Chat Service — Real-Time Messaging ort: 8083
==================================================

The Chat Service is responsible for the core messaging functionality.

==> Features

1-to-1 chat
Group chat
WebSocket communication
STOMP messaging
Message history
Read receipts
Chat rooms
Group management
E2EE public key storage
WebSocket

The frontend connects using:

STOMP + SockJS
Main Components
Controller/
├── ChatController.java
├── GroupController.java
└── KeysController.java
WebSocket/
├── WebSocketConfig.java
└── WebSocketAuthInterceptor.java
Entity/
├── Message.java
├── ChatRoom.java
├── Group.java
└── UserPublicKey.java
Service/
├── ChatService.java
├── GroupService.java
└── KeyService.java
Kafka/
├── ReadReceiptEventProducer.java
└── ChatEventProducer.java


6. Notification Service Port: 8084
=========================================

The Notification Service handles asynchronous events and real-time notifications.

==> Responsibilities

Kafka event consumption
Notification storage
Unread message counters
Real-time notification delivery

It consumes events using:
@KafkaListener
Notifications are pushed to users through WebSocket queues:

/queue/notifications
/queue/unread-count

The frontend immediately updates notification badges and displays alerts without requiring a page refresh.


7. Apache Kafka & Zookeeper port 9092
========================================
Kafka provides asynchronous communication between microservices.

Example Flow

User Service / Chat Service
            │
            ▼
       Apache Kafka
            │
            ▼
  Notification Service
            │
            ▼
 PostgreSQL + WebSocket Push
            │
            ▼
       Frontend UI

=================
Topics
=================
chat-events
presence-topic
Example Events
USER_ONLINE
USER_OFFLINE
MESSAGE_SENT
READ_RECEIPT

This allows services to communicate without blocking the main request flow.



8. Spring Boot Admin & Actuator
==============================================
Admin Server Port: 8090

Spring Boot Admin provides a centralized dashboard for monitoring microservices.

Monitor
Service health
Memory usage
Active threads
Application metrics
Log levels
Actuator endpoints





                    ==============================================
                            End-to-End Encryption (E2EE)
                    ==============================================

The application uses client-side encryption.

The server does not need plaintext message content to store or forward messages.
Encryption Process


==>  Step 1 — RSA Key Pair
==============================
The user's browser generates an RSA-OAEP key pair.

RSA-OAEP
2048-bit
Public Key → Stored by the backend for key exchange
Private Key → Remains on the user's browser


Step 2 — AES Message Encryption
==================================
Before sending a message:

A random AES key is generated.
The message is encrypted using:
AES-GCM
256-bit
The AES key is encrypted using the receiver's RSA Public Key.

The payload contains:

{
  "ciphertext": "...",
  "encryptedAesKey": "...",
  "iv": "..."
}


Step 3 — Server Processing
=============================
The encrypted message is sent through STOMP WebSockets.

Sender Browser
      ↓
Encrypted Message
      ↓
Chat Service
      ↓
PostgreSQL
      ↓
WebSocket Broadcast
      ↓
Receiver Browser
The backend stores and transfers encrypted content.

Step 4 — Message Decryption
===================================
The receiver:

Uses their RSA Private Key to decrypt the AES key.
Uses the AES key to decrypt the ciphertext.
Displays the original plaintext message.

Encryption and decryption are handled in the browser using:

Web Crypto API
window.crypto.subtle


                ========================================        
                          1-to-1 Chat Flow
                ========================================

1. Room Generation
====================

When User A starts a conversation with User B, a deterministic privacy room is generated.

Example:

userA_userB
2. WebSocket Subscription
The frontend subscribes to:
/topic/room/userA_userB

3. Message Encryption
The sender:
Fetch Receiver Public Key
          ↓
Generate AES-256-GCM Key
          ↓
Encrypt Message
          ↓
Encrypt AES Key Using RSA Public Key

4. Message Publishing
The encrypted message is sent through STOMP.
/app/chat.sendMessage


5. Backend Processing
The Chat Service:

Receives the encrypted payload.
Stores it in PostgreSQL.
Broadcasts it to the chat room.
/topic/room/userA_userB


6. Receiver Decryption
Encrypted WebSocket Frame
          ↓
Decrypt AES Key with RSA Private Key
          ↓
Decrypt Ciphertext
          ↓
Display Original Message


                            =========================================
                                        Group Chat Flow
                            ==========================================

Step 1 — Create Group
======================
POST /api/groups/create

The backend creates a unique:
groupId

Step 2 — Subscribe to Group
==============================
Members subscribe to:
/topic/room/group_{groupId}

Step 3 — Send Message
=====================
A member publishes a message using:
/app/chat.sendMessage

With:
roomId: group_{groupId}


Step 4 — Broadcast
====================
The Chat Service:

Receives Message
       ↓
Stores in Chat Database
       ↓
Broadcasts to Group Topic
       ↓
All Active Members Receive Message


Kafka Notification Flow
User Service / Chat Service
             │
             ▼
        Kafka Topics
   ┌───────────────────┐
   │ chat-events       │
   │ presence-topic    │
   └───────────────────┘
             │
             ▼
    Notification Service
             │
             ▼
   Save Notification / Update
       Unread Counter
             │
             ▼
       STOMP WebSocket
       /queue/notifications
       /queue/unread-count
             │
             ▼
       Frontend Updates
End-to-End Flow

A message is sent or user presence changes.
User Service or Chat Service publishes a Kafka event.
Notification Service consumes the event asynchronously.
Notification records and unread counters are processed.
A real-time WebSocket notification is pushed to the recipient.
The frontend updates the notification badge and toast alerts instantly.





===================================================================================================
                                Frontend 
===================================================================================================


                    ================================================
                                Frontend Architecture
                    =================================================


The frontend is built using React and TypeScript.

Main Technologies
===================================
React 18
TypeScript
Vite
Redux Toolkit
React Redux
React Router DOM v6
STOMP.js
SockJS Client
Web Crypto API
Axios
Tailwind CSS
Shadcn UI
Framer Motion
Lucide React
Frontend Components
App.tsx
The application root.
======================================
Handles:


BrowserRouter
Redux Provider
Lazy loading
Suspense boundaries
Network offline monitoring
Authentication Guards
PublicRoute
ProtectedRoute


===== >>   Responsibilities:
==========================================
Unauthenticated users → /login
Authenticated users → /dashboard
Navigation
Navbar.tsx
====================================


                        =====================================
                                  Features:
                        ========================================
Dark mode toggle
Global user search
Notifications
Unread badge
Profile menu
Sidebar.tsx
=====================


Displays:

Chats
Groups
Search filter
Chat room lists
Chat Components
ChatWindow.tsx
ChatHeader.tsx
ChatInput.tsx
MessageList.tsx
ChatListItem.tsx
OnlineStatusBadge
======================================


===> Features:


Real-time messages
Online status
Message previews
Unread counters
Timestamps
Read receipts
E2EE status
Group Components
GroupChatWindow.tsx
GroupInfoPanel.tsx
CreateGroupModal.tsx
AddMemberModal.tsx

===> Features:

Group creation
Member management
Admin controls
Real-time group messages
Notification Components
NotificationBell.tsx
NotificationItem.tsx

===> Features:

Real-time notification updates
Unread notification count


            ========================================================================
                                   Application Features


Authentication & Authorization
Email and password registration
Login
JWT Access Tokens
Refresh Tokens
OAuth2 authentication
Google login
GitHub login
Email OTP verification
Password reset
 Real-Time 1-to-1 Chat
Instant messaging
WebSocket communication
Automatic privacy room generation
Message history
Sent status
Delivered status
Read status
Read receipt indicators
 Real-Time Group Chat
Create groups
Search users
Add members
Remove members
Admin roles
Group management
Instant message broadcasting
 Client-Side E2EE
RSA-OAEP 2048-bit key pair
AES-GCM 256-bit message encryption
Web Crypto API
Public key storage
Encrypted message storage
Client-side encryption and decryption
 Presence & Notifications
Online status
Offline status
Kafka event streaming
Real-time notifications
Unread message counts
 User Management
Profile management
Avatar
Bio
Phone number
Block users
Unblock users
Message restriction for blocked users

===================================================================================================
                                   Database Architecture
===================================================================================================
The application follows a Database-per-Service approach.

Each business service owns its own PostgreSQL database.

Database	Service	Main Data
Auth-Services-DB	Auth Service	Users, tokens, OTPs
User-Services-DB	User Service	Profiles, presence, blocked users
Chat-Services-DB	Chat Service	Messages, rooms, groups, public keys
Notification-Services-DB	Notification Service	Notifications, unread counters
Database Isolation
Auth Service         → Auth Database
User Service         → User Database
Chat Service         → Chat Database
Notification Service → Notification Database

This separation keeps service data isolated and allows each service to manage its own persistence layer.