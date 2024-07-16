FROM node:20.10.0

WORKDIR /src

COPY ./mini-hackathon-2 ./

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
