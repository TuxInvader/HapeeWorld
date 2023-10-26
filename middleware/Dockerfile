FROM ubuntu:jammy

ENV NVM_VERSION="v0.39.5"
ENV NVM_DIR="/usr/local/nvm"
ENV WORK_DIR="/usr/app"
ENV NODE_VERSION="18"
ENV BS_VERSION="5.3.2"
ENV APP_NAME="apiserver"
ENV NODE_ENV="production"

ENV API_ACCESS_USER="devdave"
ENV API_ACCESS_PASS="S0m3_n0N_R4nd0M_v4|u3"


WORKDIR "${WORK_DIR}"
EXPOSE 3000

ARG DEBIAN_FRONTEND=noninteractive
RUN set -x \
    && apt-get update && apt-get install -y --no-install-recommends git curl gnupg2 software-properties-common apache2-utils \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" \
       | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update && apt-get install -y mongodb-org

RUN set -x \
    && mkdir -p "${WORK_DIR}" \
    && mkdir -p "${NVM_DIR}" \
    && curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash \
    && . "${NVM_DIR}/nvm.sh" \
    && nvm install "$NODE_VERSION"

COPY ./app/ /usr/app

RUN set -x \
    && . "${NVM_DIR}/nvm.sh" \
    && cd "/usr/app/${APP_NAME}" \
    && npm install \
    && npm i pm2 -g

ENTRYPOINT ["/usr/app/run.sh"]

