export const LATEST_VERSION = "latest";

export const DEPLOY_FILE = "schema.graphql";
export const FAKER_DEPLOY_FILE = "faker.json";
export const ENDPOINT_CONFIGURATION_FILE = "cloudConfig.json";
export const JAMSTACK_CONFIG_FILE = "jamstack.json";

export const IS_VERSION_FILE_REGEX = /^schema-(.*)\.json$/;

export const SLACK_JOIN = `https://discord.gg/wVcZdmd`;

export const CLOUD_FOLDERS = {
  // GraphQL Cloud editable files
  nocode: "nocode",
  /// GraphQL Cloud Forms
  forms: "forms",
  widgets: "widgets",
  restproxy: "restproxy",
  webhooks: "webhooks",
  gql: "gql",
  models: "models",
  // Microservice cloud editable files
  microserviceJs: "microservice/js",
  // Microservice cloud editable files
  microserviceGo: "microservice/go",
  // Deployment function artifact
  microservices_deployment: "microservices_deployment",
  // JAMStack cloud editable files
  frontend: "frontend",
  // JAMStack deployments available on pages.graphqleditor.com
  jamstack: "jamstack",
  gql_tests: "gql_tests",
  holygrail: "holygrail",
} as const;

export const VERSIONED_FILES = (version: string) =>
  ({
    schema: `schema-${version}.graphql`,
    schemaConfig: `schema-${version}.json`,
    libraries: `stitch-${version}.graphql`,
  } as const);

export const COMMON_FILES = (v: string) => ({
  version: VERSIONED_FILES(v).schemaConfig,
  code: VERSIONED_FILES(v).schema,
  libraries: VERSIONED_FILES(v).libraries,
  jamstack: JAMSTACK_CONFIG_FILE,
  faker: FAKER_DEPLOY_FILE,
  hosts: fileInCloudFolder("gql")(ENDPOINT_CONFIGURATION_FILE),
  stucco: fileInCloudFolder("microserviceJs")(STUCCO_FILE),
  packageJSON: fileInCloudFolder("microserviceJs")(PACKAGE_JSON_FILE),
});

export const MICROSERVICE_DEPLOYMENT_FILE = "function.zip";
export const STUCCO_FILE = "stucco.json";
export const PACKAGE_JSON_FILE = "package.json";

export const jamstackDeploymentUrl = (projectId: string) =>
  `https://project-${projectId}.pages.graphqleditor.com`;

export const fileInCloudFolder =
  (k: keyof typeof CLOUD_FOLDERS) => (fileName: string) => {
    return `${CLOUD_FOLDERS[k]}/${fileName}`;
  };
