FROM debian:stretch as builder 

# aurelia needs git, current node solution needs curl and gpg
RUN apt-get update && apt-get -y install curl gpg git 
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get -y install nodejs
RUN npm install -g aurelia-cli

WORKDIR /build
# Npm dependency lists get imported separately to let docker cache the 
# npm install
COPY package-lock.json package.json /build/
RUN npm install 

COPY . .
ARG env=dev
RUN au build --env $env

from nginx:mainline
COPY --from=builder /build /usr/share/nginx/html
