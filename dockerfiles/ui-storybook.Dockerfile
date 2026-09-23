FROM node:24.16.0 AS builder

RUN npm install -g npm@11.11.0

WORKDIR /app

# Install root workspace deps (covers ui devDeps: storybook, vite, etc.)
COPY package.json package-lock.json ./
COPY ui/package.json ./ui/
RUN --mount=type=cache,id=npm-cache,target=/root/.npm npm ci

# Copy ui source (includes .storybook/ and playground/)
COPY ui/ ./ui/
# staticDirs in .storybook/main.ts references this path
COPY front/public/static/ ./front/public/static/

# Build storybook static site → ui/storybook-static/
RUN npm -w ui run build-storybook

# Install playground deps (standalone package, not a root workspace)
WORKDIR /app/ui/playground
RUN --mount=type=cache,id=npm-cache,target=/root/.npm npm ci
# Build playground at /playground/ base path so assets resolve correctly under that prefix
RUN npm run build -- --base /playground/

FROM nginx:1.27-alpine

COPY --from=builder /app/ui/storybook-static/ /usr/share/nginx/html/storybook/
COPY --from=builder /app/ui/playground/dist/ /usr/share/nginx/html/playground/
COPY dockerfiles/ui/ui-storybook-nginx.conf /etc/nginx/conf.d/default.conf

ARG COMMIT_HASH
ARG COMMIT_HASH_LONG
ARG DD_GIT_REPOSITORY_URL=https://github.com/ruby-ai-ops/ruby-final
ARG DD_GIT_COMMIT_SHA=${COMMIT_HASH_LONG}
ENV DD_GIT_REPOSITORY_URL=${DD_GIT_REPOSITORY_URL}
ENV DD_GIT_COMMIT_SHA=${DD_GIT_COMMIT_SHA}

EXPOSE 80
