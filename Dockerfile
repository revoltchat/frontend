FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /build
WORKDIR /build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build:deps
RUN pnpm build:web:prod

FROM halverneus/static-file-server
COPY --from=build /build/packages/client/node_modules /app/node_modules
COPY --from=build /build/packages/client/dist /app
COPY ./static-server.yml /config.yml
EXPOSE 8000
CMD [ "--config", "/config.yml" ]