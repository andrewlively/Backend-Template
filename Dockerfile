# Use Node.js 10 LTS
FROM node:dubnium

# Create project directories
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/config

WORKDIR /usr/src/app

# Copy project resources
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
COPY tsconfig.json /usr/src/app/
COPY ./src /usr/src/app/src
COPY ./config/default.json /usr/src/app/config/default.json
COPY ./config/custom-environment-variables.json /usr/src/app/config/custom-environment-variables.json

# Install server deps
RUN npm install

# Compile server code
RUN npm run compile

# Remove TS server code
RUN rm -rf /usr/src/app/src

# Run app in production mode
ENV NODE_ENV=production

EXPOSE 28960
CMD [ "npm", "start" ]