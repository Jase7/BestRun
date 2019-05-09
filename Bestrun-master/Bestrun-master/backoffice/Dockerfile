# Create image based off of the official Node 6 image
FROM node:9
RUN apt-get update
# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new dir
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

RUN rm -rf node_modules; rm -rf package-lock.json
# Install dependecies
#RUN npm install -g @angular/cli
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]
