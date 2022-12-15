export const CommandAzure = () => {};

const template = ({ name }: { name: string }) => `
stages:
  - build
  - test
  - deploy image
  - deploy
  - envs

variables:
  RUNTIME: node
  RUNTIME_VERSION: 14
  PLAN_SKU: B1
  STORAGE_PLAN: Standard_LRS
  FUNCTION_VERSION: 3
  LOCATION: westeurope
  RESOURCE_GROUP: ${name}
  ASPLAN: ${name}
  ROUTER_APP: ${name}-api
  FUNCTION_APP: ${name}-api-functions
  STORAGE_SA: ${name}apidevsa
  AZURE_USER: gitlab@aexolaexol.onmicrosoft.com
.variables_prod: &variables_prod
  RESOURCE_GROUP: ${name}-p
  ASPLAN: ${name}-p
  ROUTER_APP: ${name}-p-api
  FUNCTION_APP: ${name}-p-api-functions
  STORAGE_SA: ${name}papiprodsa
  CORS_ORIGINS: >
    https://staging.profitabee.com https://app.profitabee.com https://business.aexol.com http://localhost:3000 https://functions.azure.com https://functions-staging.azure.com https://functions-next.azure.com
.variables_staging: &variables_staging
  RESOURCE_GROUP: ${name}-s
  ASPLAN: ${name}-s
  ROUTER_APP: ${name}-s-api
  FUNCTION_APP: ${name}-s-api-functions
  STORAGE_SA: ${name}papistagsa
  CORS_ORIGINS: >
    https://staging.profitabee.com https://app.profitabee.com http://localhost:3000 https://functions.azure.com https://functions-staging.azure.com https://functions-next.azure.com

build:
  stage: build
  image:
    name: mcr.microsoft.com/azure-functions/node:3.0-node14-appservice-stage4
    entrypoint: ['']
  script:
    - npm install
    - npm run build
    - rm -r node_modules
    - npm install --production
    - openssl genrsa -out ca.key 2048
    - openssl req -new -key ca.key -x509 -out ca.pem -days 3650 -subj '/CN=www.example.com/O=My Company Name LTD./C=AU'
    - openssl req -new -nodes -newkey rsa:2048 -keyout key.pem -out cert.req -subj '/CN=www.example.com/O=My Company Name LTD./C=AU'
    - openssl x509 -req -in cert.req -CA ca.pem -CAkey ca.key -CAcreateserial -out cert.pem -days 3650
    - npx stucco azure zip-router
    - npx stucco azure zip-function
  artifacts:
    paths:
      - dist
    expire_in: 1 week

.environment_ci_setup: &environment_ci_setup
  - az login -u \$[AZURE_USER} -p \$[AZURE_SECRET}
  - az webapp cors remove -g $RESOURCE_GROUP -n $ROUTER_APP --allowed-origins
  - az functionapp cors add -g $RESOURCE_GROUP -n $ROUTER_APP --allowed-origins \$[CORS_ORIGINS:-'*'}
  - az functionapp config appsettings set -g $RESOURCE_GROUP -n $FUNCTION_APP --settings "MONGO_URL=\$[MONGO_URL}"
  - az functionapp config appsettings set -g $RESOURCE_GROUP -n $FUNCTION_APP --settings "GRAPHQL_EDITOR_TOKEN=\$[GRAPHQL_EDITOR_TOKEN}"
  - az functionapp config appsettings set -g $RESOURCE_GROUP -n $FUNCTION_APP --settings "JWT_SECRET=\$[JWT_SECRET}"


.deploy_init: &deploy_init
  image: mcr.microsoft.com/azure-cli
  stage: deploy
  script:
    - az login -u \$[AZURE_USER} -p \$[AZURE_SECRET}
    - az group create -n $RESOURCE_GROUP -l $LOCATION
    - az appservice plan create -g $RESOURCE_GROUP -n $ASPLAN -l $LOCATION --sku $PLAN_SKU --is-linux
    - az storage account create -n $STORAGE_SA -l $LOCATION -g $RESOURCE_GROUP --sku $STORAGE_PLAN
    - az functionapp create -n $ROUTER_APP -g $RESOURCE_GROUP --storage-account $STORAGE_SA -p $ASPLAN --os-type Linux --functions-version $FUNCTION_VERSION --runtime $RUNTIME --runtime-version $RUNTIME_VERSION
    - az functionapp config appsettings set -g $RESOURCE_GROUP -n $ROUTER_APP --settings WEBSITE_RUN_FROM_PACKAGE=1
    - az functionapp config appsettings set -g $RESOURCE_GROUP -n $ROUTER_APP --settings "STUCCO_AZURE_WORKER_BASE_URL=https://\$[FUNCTION_APP}.azurewebsites.net"
    - az functionapp create -n $FUNCTION_APP -g $RESOURCE_GROUP --storage-account $STORAGE_SA -p $ASPLAN --os-type Linux --functions-version $FUNCTION_VERSION --runtime $RUNTIME --runtime-version $RUNTIME_VERSION
    - az functionapp config appsettings set -g $RESOURCE_GROUP -n $FUNCTION_APP --settings WEBSITE_RUN_FROM_PACKAGE=1
    - az functionapp update --set clientCertEnabled=true -n $FUNCTION_APP -g $RESOURCE_GROUP

deploy_init_dev:
  environment:
    name: dev
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'
      when: manual
  <<: *deploy_init

deploy_init_prod:
  environment:
    name: prod
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
  variables:
    <<: *variables_prod
  <<: *deploy_init
deploy_init_staging:
  environment:
    name: prod
  rules:
    - if: '$CI_COMMIT_BRANCH == "staging"'
      when: manual
  variables:
    <<: *variables_staging
  <<: *deploy_init

.deploy: &deploy
  image: mcr.microsoft.com/azure-cli
  stage: deploy
  script:
    - az login -u \$[AZURE_USER} -p \$[AZURE_SECRET}
    - az functionapp deployment source config-zip -g $RESOURCE_GROUP -n $FUNCTION_APP --src dist/function.zip
    - az functionapp deployment source config-zip -g $RESOURCE_GROUP -n $ROUTER_APP --src dist/router.zip
    - *environment_ci_setup

deploy_dev:
  environment:
    name: dev
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'
  <<: *deploy

deploy_staging:
  environment:
    name: prod
  variables:
    <<: *variables_staging
  rules:
    - if: '$CI_COMMIT_BRANCH == "staging"'
      when: manual
  <<: *deploy

deploy_prod:
  environment:
    name: prod
  variables:
    <<: *variables_prod
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
  <<: *deploy
`;
