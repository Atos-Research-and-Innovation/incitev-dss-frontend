# INCIT-EV Decisions Support System Frontend

This repository contains the source code of the frontend of the INCIT-EV Decision Support System (DSS). 
The backend code can be found [in this repository](https://github.com/LINKS-FCC/INCIT-EV_DSS).

It has been developed as part of the [INIT-EV project](https://www.incit-ev.eu/).

## Getting started

In order to get this project up and running, you first need to set up the DSS backend.

### Local setup

1. You can run all the necessary components of the DSS locally using Docker Compose:

```
git clone https://github.com/LINKS-FCC/INCIT-EV_DSS.git
cd backend/dss/docker
docker-compose up -d
```

The DSS backend is composed of four main components:
- `dss-backend`: this is the API the frontend uses to perform simulations.
- `dss-integration`: the simulation engine. Only the backend can perform requests to it.
- `mongo-db`: the database used to stored users, projects and analyses.
- `mongo-express`: optional component to ease external access to the database.

The frontend only interacts with the `dss-backend` component, which should be available at
http://localhost:5000 . However, to work properly, the DSS database needs to be initialized.
More info about this can be found in the [here in the backend repository](https://github.com/LINKS-FCC/INCIT-EV_DSS/tree/main/backend/dss).

2. You can now set the needed environment variables for the frontend to run locally:

```
export DSS_BACKEND_BASE_URL="http://127.0.0.1:5001/"
export NEXTAUTH_URL="http://127.0.0.1:3000/"
export NEXTAUTH_SECRET="<your_secret>"
```

The [NEXTAUTH_SECRET](https://next-auth.js.org/configuration/options#nextauth_secret) is used 
to encrypt the session token. You can generate a random string using the following command:

```
openssl rand -base64 32
```

3. You are now ready to build the frontend using whatever package manager you prefer. For example, using yarn:

```
cd src/frontend
yarn install
yarn build
yarn dev run
```

You can now access the DSS frontend at http://localhost:3000 .

