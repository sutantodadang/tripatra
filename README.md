# triparta

## Environment setup

You need to have [Go](https://go.dev/),
[Pnpm](https://pnpm.io/),
[Node.js](https://nodejs.org/) and
[Docker](https://www.docker.com/)
installed on your computer.

Verify the tools by running the following commands:

```sh
go version
pnpm --version
docker --version
```

If you are using Windows you will also need
[gcc](https://gcc.gnu.org/). It comes installed
on Mac and almost all Linux distributions.

you need also .env both for backend and frontend setup, look into .env.example.

#### Backend

```sh
JWT_SECRET=
PROFILE=
MONGO_URI=
PORT=
```

#### Frontend

```sh
VITE_API_URL=
```

## Start in development mode

In the project directory run the command (you might
need to prepend it with `sudo` depending on your setup):

```sh
docker compose -f docker-compose-dev.yml up
```

This starts a local MongoDB on `localhost:27017`.
The application will be available on http://localhost:9999.

### Run without docker

Navigate to the `server` folder and start the back end:

```sh
cd server
go run server.go
```

The back end will serve on http://localhost:9999.

Navigate to the `webapp` folder, install dependencies,
and start the front end development server by running:

```sh
cd webapp
pnpm install
pnpm start
```

The application will be available on http://localhost:9999.

## Start in production mode

Perform:

```sh
docker compose up
```

This will build the application and start it together with
its database. Access the application on http://localhost:9999.

## Authors

- [@sutantodadang](https://www.github.com/sutantodadang)
