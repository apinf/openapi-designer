FROM nginx:mainline

# aurelia needs git, current node solution needs curl and gpg
RUN apt-get update && apt-get -y install curl gpg git && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get -y install nodejs && rm -rf /var/lib/apt/lists/*
RUN npm install -g aurelia-cli

WORKDIR /app
# Npm package directives get imported separately to let docker cache the 
# npm install
COPY package-lock.json package.json /app/
RUN npm install 

ADD . .
ARG env=dev
RUN au build --env $env

RUN rm -rf /usr/share/nginx/html
RUN ln -s /app /usr/share/nginx/html
