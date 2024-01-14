ARG IMAGE=node:19

FROM $IMAGE

ARG CONFIG
ARG PROCESS
ARG DIR_NAME
ENV PROCESS ${PROCESS}

WORKDIR /etc/service/

COPY . .

RUN npm install