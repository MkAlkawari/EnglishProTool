#!/usr/bin/env bash
echo "Deploying project"

source ~/.bashrc
nohup dockerd &
docker version
npm install
npm install react-dropzone
npm install @heroicons/react
npm install chart.js
AWS_ROLE_ARN=arn:aws:iam::600627328431:role/CodeCatalystWorkflowDevelopmentRole-iGA_Projects npx sst deploy --stage prod
