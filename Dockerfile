FROM --platform=linux/amd64 node:18
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 8000
CMD ["npm" , "start"]