> Once you head down the GraphQL path
> forever will it dominate your destiny.

# GraphQL Editor CLI

Compatible with [GraphQL Editor](https://graphqleditor.com) projects (Free and Paid Tiers). The main goal is to provide an interactive experience creating GraphQL as a service.

## Requirements

- [GraphQL Editor](https://graphqleditor.com)
- NodeJS >= 16

- [GraphQL Editor CLI](#graphql-editor-cli)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Global](#global)
    - [Inside Repo](#inside-repo)
  - [Usage](#usage)
  - [Commmon Options](#commmon-options)
  - [Commands](#commands)
    - [Schema](#schema)
      - [Additional options](#additional-options)
    - [Create project](#create-project)
    - [Development](#development)
    - [Cloud](#cloud)
      - [Run Local Server for your GraphQL Editor Microservice in Cloud](#run-local-server-for-your-graphql-editor-microservice-in-cloud)
      - [Deploy to GraphQL Editor Microservice](#deploy-to-graphql-editor-microservice)
        - [Environment inside shared worker](#environment-inside-shared-worker)
      - [Push to cloud](#push-to-cloud)
      - [Pull from cloud](#pull-from-cloud)
    - [Code Generation](#code-generation)
      - [Typings](#typings)
      - [Additional options](#additional-options-1)
      - [Models](#models)
        - [MongoDB](#mongodb)
      - [Resolvers](#resolvers)
        - [**`stucco.json`**](#stuccojson)
    - [GraphQL Editor Integrations](#graphql-editor-integrations)
      - [Installation](#installation-1)
        - [**`package.json`**](#packagejson)
        - [**`stucco.json`**](#stuccojson-1)
      - [Development](#development-1)
        - [Data format](#data-format)
        - [**`integration.ts`**](#integrationts)
        - [Init](#init)
        - [Integrate](#integrate)
        - [Publish](#publish)
        - [Unpublish](#unpublish)

## Installation

### Global

```sh
npm i -g graphql-editor-cli
```

### Inside Repo

```sh
npm i -D graphql-editor-cli
```

then use with npx for example or as a `package.json` script.

## Usage

All comands work in 3 ways.

- You can provide all arguments with flags
- you can get them from a local config file
- complete them in interactive modes

CLI will try to get argument in this order.

## Commmon Options

All commands also take these options which refer to your GraphQL Editor project

| Option         | type   | description         |
| -------------- | ------ | ------------------- |
| namespace      | string | Your namespace name |
| project        | string | Project name        |
| projectVersion | string | projectVersion name |

## Commands

### Schema

Fetch schema from a GraphQL Editor project. Schema will be compiled with the GraphQL libraries you are using for this project.

```sh
$ gecli schema
```

#### Additional options

| Option    | type   | description                       |
| --------- | ------ | --------------------------------- |
| schemaDir | string | Directory to generate schema file |

### Create project

```sh
$ gecli create backend
```

Create a backend for your GraphQL Editor project. It will create a folder with `package.json` `stucco.json` and eslint and a prettier configuration. It is an interactive command. It will create a folder with the project name you will provide.

### Development

```sh
$ gecli dev
```

To start typescript and stucco development server reacting to your code changes.

### Cloud

#### Run a Local Server for your GraphQL Editor Microservice in Cloud

When you have a microservice in cloud with or without GraphQL Editor backend, you can run a local graphql server for your microservice using this command.

```sh
gecli cloud server
```

This command will:

1. Download your files from GraphQL Editor Cloud to a temporary folder
2. Install packages inside the folder
3. Run stucco server and typescript server inside this folder.

#### Deploy to GraphQL Editor Microservice

With this command you can deploy your project with stucco based backend to them.

```sh
gecli cloud deploy --backendZip=https://github.com/aexol-studio/monospace-backend/archive/refs/heads/main.zip
```

##### Environment inside shared worker

To pass environment variables use `-e flag` for deploys. For example

```sh
gecli cloud deploy -e DB_URL=https://exampledb.com -e HOME=$HOME
```

#### Push to cloud

Sometimes you will want to push to cloud GraphQL Editor back from the repo. So editor users can see/test the changes in the Editor browser IDE. To do it:

```sh
$ gecli cloud push
```

This will clean the cloud folder and push cwd to the editor cloud.

#### Pull from cloud

When you want to move from the cloud folder as your service is getting bigger and put the project inside the repository. You can use the pull command:

```sh
$ gecli cloud pull
```

It will pull the project to the project name folder.

### Code Generation

Code generation commands

#### Typings

Generate TypeScript typings from the GraphQL Editor project.

```sh
$ gecli codegen typings
```

#### Additional options

| Option      | type               | description                                 |
| ----------- | ------------------ | ------------------------------------------- |
| typingsDir  | string             | Path where to store generated typings files |
| typingsEnv  | "browser" or "node | Environment for typings to work with        |
| typingsHost | string             | GraphQL Server URL                          |

#### Models

```sh
$ gecli codegen models
```

Generate TypeScript Models from GraphQL types. They are very useful to use with popular Databases.

```graphql
type Person {
  firstName: String!
  lastName: String!
  email: String
  phone: String
  friends: [Person!]!
}
```

will be transformed to a model file

```ts
import type { ModelTypes } from '@/zeus';
export type Person = ModelTypes['Person'];
```

later on you may want to transform it so that it is a database model.

```ts
import type { ModelTypes } from '@/zeus';
export type Person = Omit<ModelTypes['Person'], 'friends'> & {
  friends: string[];
};
```

So you see the concept.

##### MongoDB

Here is an example how you can use your model in MongoDB.

```ts
db.collection<MyModel>.find({});
```

#### Resolvers

A CLI tool to generate [Stucco](https://github.com/graphql-editor/stucco-js) resolvers in TypeScript from GraphQL fields.

```sh
$ gecli codegen resolver
```

Given the following schema:

```graphql
type Person {
  firstName: String!
}
type Query {
  people: [Person]!
}
schema {
  query: Query
}
```

After chosing:

1. `Query`
2. `people`

It should generate a TypeScript resolver placed in `$src/Query/people.ts`

```ts
import { FieldResolveInput, FieldResolveOutput } from 'stucco-js';
import { PersonCollection } from '../db/collections';
import { DB } from '../db/mongo';
import { Utils } from '../Utils';
import { Person, ResolverType, ValueTypes } from '../graphql-zeus';

export const handler = async (): Promise<FieldResolveOutput> => {};
```

and append correct entries to `stucco.json` file.

##### **`stucco.json`**

```json
{
  "resolvers": {
    "Query.people": {
      "resolve": {
        "name": "lib/Query/people"
      }
    }
  }
}
```

and after running `stucco` your resolver should work out of the box.
Some resolver types however need a little code to make them work the way you want.

### GraphQL Editor Integrations

Both installation and development of GraphQL Editor integrations is possible.

#### Installation

Installation is done via GraphQL Editor or by just using an npm package name and providing a resolver path to node_modules path

##### **`package.json`**

```json
{
  "dependencies": {
    "gei-crud": "0.0.2"
  }
}
```

##### **`stucco.json`**

```json
{
  "resolvers": {
    "Query.objects": {
      "resolve": {
        "name": "node_modules/gei-crud/lib/Query/objects"
      },
      "data": {
        "model": {
          "value": "Pizza"
        }
      }
    }
  }
}
```

#### Development

To develop a GraphQL Editor integration use the `gecli create backend` [command](#create-project) to create your project. Then init the integration.

##### Data format

##### **`integration.ts`**

```ts
type IntegrationData = {
  name: string;
  description: string;
  value: string | string[];
  required?: boolean;
};

type IntegrationSpecification = {
  [resolver: string]: {
    name: string;
    description: string;
    data: Record<string, IntegrationData>;
    resolve: { name: string };
  };
};
const integration: IntegrationSpecification = {
  'Query.objects': {
    name: 'List objects',
    description: 'List objects stored in database',
    data: {
      model: {
        name: 'Database model',
        description: 'Specify model name',
        value: 'Object',
        required: true,
      },
      sourceFilterParameters,
    },
    resolve: {
      name: 'lib/Query/objects',
    },
  },
};
```

Later on after the `gecli gei integrate` command it integrates your typescript file to the `stucco.json`

##### Init

Init files needed to create integration from your backend project to be used in GraphQL Editor No-Code editor or as npm package.

##### Integrate

Integrate your files with project's `stucco.json`

##### Publish

Publish your integration to GraphQL Editor, to be used in GraphQL Editor No-Code editor.

##### Unpublish

Unpublish your integration from GraphQL Editor
