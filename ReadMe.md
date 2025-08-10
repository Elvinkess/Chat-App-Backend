# Chat App Backend

This is the backend of a real-time chat application powered by WebSockets. It supports both **private (direct)** and **group** messaging, along with essential user features such as account creation, login, and password recovery.

-

## ⚙️ Tech Stack

* **Node.js**
* **TypeScript**
* **WebSocket (Socket.IO)**
* **Clean Architecture**
* **Domain-Driven Design (DDD)**
* **PostGres**

---

## 📁 Project Structure

```plaintext
domain/
  dto/
    request/
    response/
    enums/
  entity/
interface/
  logic/
  services/
  data_access/
infrastructure/
  logic/
  services/
```

---

## 🧑‍💻 User Functionalities

### ✅ Create Account


* **Route:** `POST http://localhost:3000/user/create`
* **Input:** `name`, `email`, `password`
* **Behavior:** Saves new user, hashes password, returns success message.

### ✅ Login

* **Route:** `POST YOUR_SERVER_PORT/user/signin`
* **Input:** `email`, `password`
* **Behavior:** Authenticates user, returns token on success.

### ✅ Forgotten Password

* **Route:** `POST YOUR_SERVER_PORT/user/resetpassword`
* **Input:** `email`
* **Behavior:** Sends password reset instructions to email.

### ✅ Reset Password

* **Route:**  `YOUR_SERVER_PORT/user/verifyAndSet?token=YOUR_TOKEN_HERE`
* **Input:**  `email`,`newPassword`,`confirmPassword`
* **Behavior:** Reset your password

### ✅ ADD A USER/CHAT
* **Users/chat are added with their registered email address
* Group Chat are created/added by group names
---

## 💬 Chat Functionalities

### 🌍 Global Message

* **Event:** `"chat_message"`
* **Behavior:** Emits a broadcast message to all connected clients.

---

### 👥 Private Chat

* **Event:** `"private-message"`
* **Payload:** `{ senderId, receiverId, content, date, type }`
* **Behavior:**

  * Saves message to DB
  * Sends to receiver only
  * Tracks delivery using `deliveredAck` callback
  * Returns `IncomingMessageDTO` containing sender name and message data

---

### 👨‍👧‍👦 Group Chat

* **Event:** `"join-group"`

* **Payload:** `{ room, userId }`

* **Behavior:**

  * User joins a chat room
  * Emits a `"user-joined"` event to other users in the room
  * Emits a `"join-group-success"` event back to the joining user

* **Event:** `"group-message"`

* **Payload:** `{ senderId, content, roomName, type, date }`

* **Behavior:**

  * Saves message to DB
  * Sends to all other users in the room

---

### 🟢 Online Status

* **Event:** `"online-status"`
* **Payload:** `userId`
* **Behavior:**

  * Queries all chats involving the user
  * Emits `"on-line"` event to chat mates if they are online

---

### ✍️ Typing Indicator

* **Event:** `"Typing"`
* **Payload:** `{ senderId, receiverId?, room?, type }`
* **Behavior:**

  * Emits `"Typing"` event to the relevant user or room
  * Supports both DIRECT and GROUP message types

---

## 🔌 WebSocket Integration

### WebSocket Events Handled:

| Event Name        | Description                            |
| ----------------- | -------------------------------------- |
| `chat_message`    | Broadcast message to all users         |
| `private-message` | Sends message to one user              |
| `join-group`      | User joins a group room                |
| `group-message`   | Message to all in a group              |
| `Typing`          | Emits typing indicator                 |
| `online-status`   | Notifies chat mates of online presence |

---

## 🧱 Logic Overview

The core messaging logic is inside:

```ts
MessageLogic {
  setup(): void;
}
```

Inside `setup`, the socket events are registered:

* Message saving (`messageDb`)
* Socket emissions (`webSocket`)
* User retrieval (`userDb`)
* Real-time typing, group joins, and online checks

---

## 🛡️ Security & Reliability

* **JWT Auth** (expected in actual user routes)
* **Socket ID Mapping** per User
* **Acknowledgement Callbacks** for message delivery
* **Room Isolation** for group chats

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📬 Contact / For collaboration or to check other projects. / Contributions
📧 Email: Agberiakessena@example.com

Pull requests and contributions are welcome. For major changes, please open an issue first.
