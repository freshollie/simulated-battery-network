# trading-network

## Requirements

- Node 16 ([nvm](https://github.com/nvm-sh/nvm) is great for this)
- yarn (`npm install yarn -g`)
- Docker (optional)

## Run in docker-compose

```
docker-compose up
```

## Running outside of docker

Install deps

```
yarn
```

Run simulation

```
yarn start
```

The simulation output is written to `services/optimiser/output.log`

**NOTE**: The datetimes written to the log are in ISO UTC, not local time.

## Development

Unit tests are performed by `jest`. They are not extensive and just test the
APIs function as intended

```
yarn test
```

Linting is done with `xo`

```
yarn xo
```

## Rational

### Language

I chose to use `typescript` as I am very farmiliar with it, and mean I could get the repo setup quickly.
Typescript is a staticly typed language which made development really fast, and javascript is
an asynchronous first language which makes services easily scale with load (and without overhead of threading).

I would be comfortable writing this sort of test in Python, and with a littlebit more time, go or rust.

### Workspaces

This repo is built with `yarn workspaces`, a monorepo dependency tool which lets us organise our services
within the monorepo. The advantage of having our services in the same repo would be shared code and type interfaces.
For future development (and given more time), some of the shared boiler plate between services can be extraced and
referenced within the repo (without having to deploy a package to npm)

### Dockerfile

I utilised a shared Dockerfile for all the services (part of the advantage of having a monorepo). The build-args can be used
to provide the context to docker for which service to build.
