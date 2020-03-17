### IGO Sample Submission Frontend
 
* react ^16.8
* redux ^4.0.1
* handsontable ^7.0.3
* node, npm

### Install locally
* clone repo
* copy config file from VM /srv/www/dev and adjust to your dev environment 
* npm install
* npm start


### Commit and PR Strategy
* create feature branch
* make sure `npm test` and `npm build` succeed
* create PR with *development* branch (Travis build will fail due to missing config file)
* wait for review before merge
