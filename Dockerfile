# Base image
FROM node

ARG proxy

ENV HTTP_PROXY ${proxy}
ENV HTTPS_PROXY ${proxy}

WORKDIR /src/app

# Install modules
COPY ./package.json ./tsconfig.json ./gulpfile.js /src/app/
RUN yarn install

ADD ./src /src/app/src

# Expose port 3000 from the container to the host
EXPOSE 3000

CMD npm start
