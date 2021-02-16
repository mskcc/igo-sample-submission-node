# IGO Sample Submission 

## Development Setup
### Frontend

1) Setup
    ```
    cd frontend
    npm install
    npm run config-dev      # Copies configurations 
    npm run start           # application should be started on localhost:3000
    ```  

2) Cookie - Place cookie in session w/ localhost as domain
    - Log into https://igodev.mskcc.org/login/
    - Upon successful authentication, change domain of cookie to localhost so it's available in your local application (In Chrome: DevTools > Application > Storage:Cookies > Select Domain > Modify domain value of cookie w/ `jic` to `localhost`). If the `.env` `JWT_SECRET` doesn't match that of igo-dev, the cookie will be invalid)
    - Navigate back to `localhost:3000`, which should now have the session cookie to make requests

### Backend
1) Configurations - Update `.env` file in `api/frontend` (Not available in git repo - take from VM `dlviigoweb1` at `/srv/www/node-sample-sub/.env`)

2) Update `JWT_SECRET` field of `.env` with value located at `/srv/www/pm2/ecosystem.config.js`

`/srv/www/pm2/ecosystem.config.js`
```
...
const commonEnv = {
        dev: {},
        prod:
        {
           JWT_SECRET: 'DEV_COOKIE'   <-    1) Take this value
        }
}
...
```

`/srv/www/node-sample-sub/.env`
```
...
JWT_SECRET=DEV_COOKIE                 <-    2) Add ecosystem.config.js secret here
...
```

3) Run
```
cd api
npm install
npm run start
```
