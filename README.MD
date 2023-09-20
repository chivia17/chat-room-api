# Chat room API

## About
This chat room API is developed with TypeScript, Express, and Node.js. It uses Socket.IO for real-time communication and has RESTful endpoints for more complex operations.

## Table of Contents
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [How it works](#how-it-works)
    - [RESTful Endpoints](#restful-endpoints)
    - [Socket.IO Client](#socket-io-client)
- [Support](#support)
- [License](#license)

## Requirements

- NodeJS >= v19.4.0
- npm (Node.js package manager)
- Docker

## Getting started

To run the chat room API, follow these steps:

1. Clone the repository:

```bash
$ git clone https://github.com/chivia17/chat-room-api
```

2. Install the dependencies:

```bash
$ cd chat-room-api
$ npm install
```

3. Build the docker image

```bash
$ make build
```

or

```bash
$ docker-compose build
```

4. Start service

```bash
$ make start
```

or

```bash
$ docker-compose up -d
```

You can view the service logs with the following command:

```bash
$ make logs
```

or

```bash
$ docker-compose logs -f chat-room-ws
```

## How it works

To use the chat room API, you can either use the RESTful endpoints or the Socket.IO client.

### RESTful Endpoints

The following RESTful endpoints are available:

* `GET` - `/ping` - Check healthy of API
* `POST` - `/room/new` - Create new room
* `GET` - `/room/availables?userId=123` - Get all public rooms
* `GET` - `/room/enrolled?userId=2345` - Get rooms that user is enroll
* `GET` - `/room/history?roomId=11234` - Get message history

### Socket IO Client

To use the Socket.IO client, you will need to include the Socket.IO library in your project. Once you have included the library, you can connect to the Socket.IO server using the following code:

```ts
$ const socket = io('http://localhost:3000/chat');
```
Once you are connected to the server, you can listen for events and emit events. For example, to listen for new messages in a chat room, you would use the following code:

```ts
socket.on('message', (message) => {
  // Handle the new message
});
```

Listen notifications:

```ts
socket.on('notification', (message) => {
  // Handle the notifications
});
```

Listen errors:

```ts
socket.on('error', (message) => {
  // Handle the errors
});
```

To send a new message to a chat room, you would use the following code:

```ts
socket.emit('message', {
  room: '1234567890',
  message: 'This is a new message.'
  nickname: 'JhonDoe'
});
```

Join room:

```ts
socket.emit('join', {
  room: '1234567890',
  nickname: 'JhonDoe'
});
```

Leave room:

```ts
socket.emit('leave', {
  room: '1234567890',
  nickname: 'JhonDoe'
});
```

Link username with socket ID:

```ts
socket.emit('new-user', {
  nickname: 'JhonDoe'
});
```

## Support

If you need help with the chat room API, please contact us at: https://github.com/chivia17

## License

The chat room API is licensed under the MIT license.