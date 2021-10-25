export const NAME_REGEX = /^([A-z0-9_-])*$/;
export const LATEST_VERSION = "latest";
export const VERSION_JSON_FILE = (name: string) => `schema-${name}.json`;
export const VERSION_SCHEMA_FILE = (name: string) => `schema-${name}.graphql`;
export const VERSION_STITCH_FILE = (name: string) => `stitch-${name}.graphql`;

export const DEPLOY_FILE = "schema.graphql";
export const FAKER_DEPLOY_FILE = "faker.json";
export const ENDPOINT_CONFIGURATION_FILE = "cloudConfig.json";

export const IS_FAKER_DEPLOY_FILE_REGEX = /^faker.json$/;
export const IS_DEPLOY_FILE_REGEX = /^schema.graphql$/;
export const IS_VERSION_FILE_REGEX = /^schema-(.*)\.json$/;
export const IS_VERSION_SCHEMA_FILE_REGEX = /^schema-(.*)\.graphql$/;
export const IS_VERSION_STITCH_FILE_REGEX = /^stitch-(.*)\.graphql$/;

export const SLACK_JOIN = `https://discord.gg/wVcZdmd`;

export const CLOUD_FOLDERS = {
  // GraphQL Cloud editable files
  gql: "gql",
  // Microservice cloud editable files
  microservice: "microservice",
  // Deployment function artifact
  microservices_deployment: "microservices_deployment",
  // JAMStack cloud editable files
  frontend: "frontend",
  // JAMStack deployments available on pages.graphqleditor.com
  jamstack: "jamstack",
} as const;

export const MICROSERVICE_DEPLOYMENT_FILE = "function.zip";
export const STUCCO_FILE = "stucco.json";
export const microservicesLanguages = {
  JAVASCRIPT: "javascript",
  GO: "go",
};

export const microservicesLanguagesExtensions = {
  JAVASCRIPT_EXT: "js",
  GO_EXT: "go",
};

export const jamstackDeploymentUrl = (projectId: string) =>
  `https://project-${projectId}.pages.graphqleditor.com`;

export const fileInMicroserviceFolder =
  (extension: string) => (fileName: string) =>
    `${CLOUD_FOLDERS.microservice}/${extension}/${fileName}`;

export const fileInCloudFolder =
  (k: keyof typeof CLOUD_FOLDERS) => (fileName: string) =>
    `${CLOUD_FOLDERS[k]}/${fileName}`;
