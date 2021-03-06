deploy-dev:
	cd ./frontend && npm run build && cd - && \
	cd ./api && cp -rf ../frontend/build/* ./public && cd - && \
	scp -r ./api/ igodev:deployments/node-sample-sub

quick-deploy-dev:
	cd ./api && cp -rf ../frontend/build/* ./public && cd - && \
	scp -r ./api/ igodev:deployments/node-sample-sub

config-dev:
	cd frontend && npm run config-dev && cd -

config-qa:
	cd frontend && npm run config-qa && cd -

config-prod:
	cd frontend && npm run config-prod && cd -
