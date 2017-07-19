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
# TODO add arg support for building other environments than
# the one in use at the git repo (e.g. production)
RUN au build

RUN rm -rf /usr/share/nginx/html
RUN ln -s /app /usr/share/nginx/html
