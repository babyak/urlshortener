## URL shortener in React & Nest.js using Postgres & Redis

Implements Backend API in Nest.js for Landing Page UI & Administration management UI for shortened links.

### Run it locally using docker compose

```bash
$ docker-compose build && docker-compose up
```

Landing page: [http://localhost:8088](http://localhost:8088/) 

Admin page: [http://localhost:8088/admin](http://localhost:8088/admin) 

API Swagger Docs: [http://localhost:3000/swagger](http://localhost:3000/swagger) 


### Structure 
Application consist of backend Nestjs Application, frontend React Application, Postgresql and Redis Databases

#### Backend
Nestjs API source codes can be found in `/backend` directory

Folder structure:
- `/backend/src/url` - contains application logic controller, service and model 
- `/backend/src/auth` - contains application authentication using Header x-api-key
- `/backend/src/blacklist` - contain middleware to reject blacklisted url using Regexp

#### Frontend
Frontend is build with Create React App and React Admin (https://github.com/marmelab/react-admin)


_PS: this was an interwiew/excercise homework_
