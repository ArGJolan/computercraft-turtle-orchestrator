FROM node:12-alpine

ENV NODE_ENV=prod
EXPOSE 4261

# Copy app
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./package*.json /opt/app/
RUN npm install --production
COPY . /opt/app

CMD ["sh", "-c", "npm start"]
