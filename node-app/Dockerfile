FROM node:11

RUN apt update

ARG PROJECT_DIR
RUN mkdir -p ${PROJECT_DIR} && chown -R node:node ${PROJECT_DIR}
WORKDIR ${PROJECT_DIR}

USER node
COPY package*.json ./
RUN npm set progress=false \
    && npm ci

COPY . .

CMD [ "node", "index.js" ]