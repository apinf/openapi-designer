FROM nginx:mainline

# aurelia needs git
RUN apt-get update && apt-get -y install curl gpg
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get -y install git nodejs
RUN npm install -g aurelia-cli

WORKDIR /app
ADD . .

RUN npm install && au build 

#TODO make openapi-designer appear at hostname/ not at hostname/app/
#RUN rm -rf /usr/share/nginx/html
RUN mv /app /usr/share/nginx/html
