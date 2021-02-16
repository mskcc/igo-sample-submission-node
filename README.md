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

2) Add `.env` (Not available in git repo - take from VM)  

3) Cookie - Place cookie in session w/ localhost as domain
    - Log into https://igodev.mskcc.org/login/
    - Upon successful authentication, change domain of cookie to localhost so it's available in your local application (In Chrome: DevTools > Application > Storage:Cookies > Select Domain > Modify domain value of cookie w/ `jic` to `localhost`). If the `.env` `JWT_SECRET` doesn't match that of igo-dev, the cookie will be invalid)
    - Navigate back to `localhost:3000`, which should now have the session cookie to make requests

**Why?**: Node sample submission requires authentication in XHR requests. If you do not do this, then backend requests will error and not return any data

### Backend
```
cd api
npm install
npm run start
```
