FROM node:16 as build

WORKDIR /build

ARG SERVICE_NAME

# In CI this may include the dependency cache
# So a real win for faster builds (as we don't need to install deps)
COPY . .
RUN yarn install --immutable 
RUN yarn build
RUN yarn workspaces focus ${SERVICE_NAME} --production

# Second layer, so that we only include production deps
FROM node:16-alpine

ARG SERVICE_NAME

WORKDIR /trading-network/
COPY --from=build /build/node_modules node_modules
COPY --from=build /build/services/${SERVICE_NAME}/dist services/${SERVICE_NAME}/dist

WORKDIR /trading-network/services/${SERVICE_NAME}/

ENV NODE_ENV=production

ENTRYPOINT [ "node" ]
