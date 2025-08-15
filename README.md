# Popup Chat Widget

A full-stack chat application featuring group chat, media/file sharing, quick replies, and a chatbot, built with React (frontend) and Node.js + Socket.IO (backend).

---

## Features

### Frontend (React + Vite)

- **Group Chat:** Create and join chat groups with unique names.
- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **Media & File Sharing:** Share images, videos, and files in chat.
- **Quick Replies:** Use predefined quick replies for faster communication.
- **Typing Indicators:** See when other users are typing.
- **Chatbot:** Interact with an AI-powered chatbot for automated responses.
- **Group Management:** Admins can accept/reject join requests and delete groups.
- **User Presence:** Online/offline status indicators.
- **Responsive UI:** Optimized for desktop and mobile screens.

### Backend (Node.js + Socket.IO)

- **Socket.IO Server:** Handles real-time communication for chat, typing, group management, and notifications.
- **Group Management:** Create, join, and delete groups; manage group members and requests.
- **Message Delivery:** Supports message status (sent, delivered, seen).
- **Media/File Handling:** Relays media and file URLs between users.
- **Admin Controls:** Only group admins can approve join requests and delete groups.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recommended)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Local Development

#### 1. Install dependencies

```sh
cd chat-app
pnpm install

cd ../server
pnpm install

##start the backend
cd server
node [server.js](http://_vscodecontentref_/0)

##start the frontend
cd chat-app
pnpm dev

##docker setup
docker-compose up --build
```

#### 2. Project Structure

```
popup-chat-widget/
├── chat-app/      # Frontend (React)
│   ├── src/
│   │   ├── Components/
│   │   ├── Contexts/
│   │   └── ...
│   ├── public/
│   └── ...
├── server/        # Backend (Node.js + Socket.IO)
│   └── [server.js]
├── [docker-compose.yaml]
└── [README.md]
```
