deploy:
	cd ./frontend && npm run build && cd - && \
	cd ./api && cp -rf ../frontend/build ./public && cd - && \
	rsync -a ./api/ wagnerl@igodev:deployments/promote
