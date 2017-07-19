FROM nginx:mainline

# aurelia needs git
RUN apt-get update && apt-get -y install curl gpg
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get -y install git nodejs
RUN npm install -g aurelia-cli

WORKDIR /app
ADD . .

# TODO add arg support for building other environments than
# the one in use at the git repo (e.g. production)
RUN npm install && au build 

RUN rm -rf /usr/share/nginx/html
RUN ln -s /app /usr/share/nginx/html

