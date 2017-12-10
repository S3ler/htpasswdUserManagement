FROM arm32v7/node:8.9.3

# set working directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
ADD bin ./bin
ADD htpasswd ./htpasswd
ADD htpasswdManagerAPI ./htpasswdManagerAPI
ADD public ./public
ADD routes ./routes
ADD views ./views
ADD app.js ./app.js

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
