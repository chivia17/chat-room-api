FROM node:18.6

WORKDIR /app/chat-room-ws

COPY package*.json ./

RUN npm install

CMD ["bash", "./scripts/start.sh"]