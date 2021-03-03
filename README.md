# matievisthekat.dev

The official rewrite repository for https://matievisthekat.dev

[![deepscan grade](https://deepscan.io/api/teams/10306/projects/14493/branches/271293/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10306&pid=14493&bid=271293)
[![maintainability](https://api.codeclimate.com/v1/badges/ec039f04ab374f4e114d/maintainability)](https://codeclimate.com/github/MatievisTheKat/matievisthekat.dev/maintainability)
[![score](https://www.code-inspector.com/project/15527/score/svg)](https://frontend.code-inspector.com/project/15527)
[![status](https://www.code-inspector.com/project/15527/status/svg)](https://frontend.code-inspector.com/project/15527)
[![discord](https://img.shields.io/discord/673605613456195584)](https://discord.gg/t65hRpd)
[![repo size](https://img.shields.io/github/repo-size/matievisthekat/matievisthekat.dev)](https://shields.io)
[![license](https://img.shields.io/github/license/MatievisTheKat/matievisthekat.dev)](https://shields.io)
[![last commit](https://img.shields.io/github/last-commit/MatievisTheKat/matievisthekat.dev)](https://shields.io)

---

## <ins>Development</ins>

### Overview

Built with a [React](https://github.com/facebook/react)/[Gatsby](https://github.com/gatsbyjs/gatsby) and [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) frontend with an [Express](https://github.com/expressjs/express) backend.

### Breakdown

Frontend:

- Gatsby
- React
- Tailwind CSS
- Axios

Backend:

- Express
- PassportJS
- Passport JWT
- Multer
- Bcrypt
- Postgresql

## <ins>Usage</ins>

### Get Started:

---

```console
$ git clone https://github.com/MatievisTheKat/matievisthekat.dev
$ cd matievisthekat.dev
```

### Setup Environment Files:

---

- `web/.env.development`:
  ```bash
  API="http://localhost:3000" # Development API url
  ```
- `web/.env.production`:
  ```bash
  API="https://api.yoursite.org" # Production API url
  ```
- `api/.env`:

  ```bash
  db.user="postgres" # Postgresql username
  db.password="1234" # Postgresql password
  db.host="localhost" # Postgresql host
  db.port="5432" # Postgresql port (default 5432)
  db.name="test" # Postgresql database name

  keys.passphrase="super_secret_passphrase" # JWT private key passphrase

  salt-rounds="25" # Salt rounds to serialize passwords with

  mail.user="admin@yoursite.org" # Mail username
  mail.password="1234" # Mail user password
  mail.host="webmail.yoursite.org" # Mail host
  mail.secure="false" # Require a secure connection to the mail host/server

  NODE_ENV="development" # Set to 'production' or remove for production mode
  ```

### Running locally (development)

---

The backend and frontend need to run on seperate NodeJS processes

- Start backend:

  ```console
  $ cd api
  $ yarn
  $ yarn start # Nodemon is installed and configured but it doesn't currently work
  ```

- Start frontend
  ```console
  $ cd web
  $ yarn
  $ yarn develop
  ```

### Running in production

---

Only the backend will need a NodeJS process to run. It is already set up to run with `pm2`

- Start backend:

  ```console
  $ cd api
  $ yarn
  $ yarn global add pm2
  $ pm2 start
  ```

- Build frontend:
  ```console
  $ cd web
  $ yarn
  $ yarn build
  ```

### Logs

---

Files stored like: `api/logs/[year]-[month]-[day].log` with the following format:

```log
[day]/[month]/[year] [hour][minute][second] [METHOD]  [duration]ms - [status] - [path]
```

For example:

```log
28/11/2020 10:28:21  POST      16ms - 401 - /cdn/upload
28/11/2020 10:30:12  DELETE    16ms - 200 - /cdn/delete
```

Every new process is marked by:

```log
#<--- NEW PROCESS --->#
```

### Keys

---

Public and private keys are stored in `api/keys/private.key` and `api/keys/public.key` respectively
