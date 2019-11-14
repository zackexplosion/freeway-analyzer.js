# Base image
FROM node:13.1
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app