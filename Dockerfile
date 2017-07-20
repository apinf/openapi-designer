FROM nginx:mainline

# aurelia needs git, current node solution needs curl and gpg
RUN apt-get update && apt-get -y install curl gpg git 
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get -y install nodejs
RUN npm install -g aurelia-cli

WORKDIR /app
# Npm dependency lists get imported separately to let docker cache the 
# npm install
COPY package-lock.json package.json /app/
RUN npm install && npm cache clean

COPY . .
ARG env=dev
RUN au build --env $env

RUN rm -rf /usr/share/nginx/html
RUN ln -s /app /usr/share/nginx/html
