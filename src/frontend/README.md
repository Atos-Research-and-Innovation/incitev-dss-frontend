# DSS frontend

This repository contains the code for the frontend of the Decision Support System (DSS)
implemented in the INCIT-EV project. The backend of the DSS can be found in 
[the corresponding LINKS repository](https://zenit.linksfoundation.com/incit-ev/dss).

## Getting Started

To be able to run and test the DSS frontend locally, you will need a way to 
communicate with the backend API. Assuming you have access to the INCIT-EV kubernetes 
cluster and the DSS backend components are deployed, the easiest way to do so is to 
port-forward to it:

```
kubectl port-forward -n dss-backend svc/dss-backend 5001:80
```

Alternatively, you can run the backend locally. To do so, you will need to clone the 
backend repository, and use its [docker compose file](https://zenit.linksfoundation.com/incit-ev/dss/-/blob/master/docker/docker-compose.yaml?ref_type=heads)
to launch it with its dependencies.

Then, you need to source the necessary variables to your environment:

```
export DSS_BACKEND_BASE_URL="http://localhost:5001/"
export NEXTAUTH_URL="http://localhost:3000/"
export NEXTAUTH_SECRET="check CI variable"
```

Finally, just build and run the development server:

```bash
cd ./src/frontend/
yarn install
yarn build
yarn dev run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
