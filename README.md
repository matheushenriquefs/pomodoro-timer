# Pomodoro Timer

A simple Pomodoro web application built with Vue.js, Typescript and Docker. In addition to the chosen tech stack, the project adheres to essential coding best practices to improve its maintainability, readability, and scalability. Throughout the project the following principles were taken into account: clean code, Don't Repeat Yourself (DRY), Keep It Simple, Stupid (KISS), You Aren't Gonna Need It (YAGNI), Separation Of Concerns (SOC), and good documentation.

## Techs

- [Vue.js](https://vuejs.org)
- [Typescript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro)
- [ESLint](https://eslint.org)
- [Commitlint](https://commitlint.js.org)
- [Docker](https://www.docker.com)

### Prerequisites

Make sure you have the following dependencies installed on your system:

```sh
Docker >= 23.0.5
Docker Compose >= 2.17.3
```

## Project Setup

1. Clone this repository.
2. Copy the `.env.example` file to `.env.`

```sh
cp .env.example .env
```

## Running The Application

Start the development server using Docker Compose.

```sh
docker compose up
```

The application will be running in development mode by default. Open your [browser](http://localhost:3000) to see it.

### Run Unit Tests

If the container is already running execute unit tests by running the following:

```sh
docker exec -it pomodoro-timer npm run test:unit
```

### Type-Check, Compile and Minify for Production

To prepare the project for production, run:

```sh
docker exec -it pomodoro-timer npm run build
```

### Preview For Production

1. Change the `NODE_ENV` value in `.env`.
2. Run the application to preview the production build locally. Open your [browser](http://localhost:3333) to see it.

```sh
docker exec -it pomodoro-timer npm run preview
```
