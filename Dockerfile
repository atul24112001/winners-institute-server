FROM --platform=linux/amd64 node:16
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 8000
ENTRYPOINT ["npm", "start"]