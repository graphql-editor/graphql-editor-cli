> Once you head down the GraphQL's path
> forever will it dominate your destiny.

# GraphQL Editor Cli

Translate GraphQL to Anything and make it your one and only source of truth. Schema. Compatible with [GraphQL Editor](https://graphqleditor.com) projects( Free and Paid Tiers). So the main goal is to provide interactive experience creating GraphQL as a service.

- [GraphQL Editor Cli](#graphql-editor-cli)
  - [Installation](#installation)
    - [Global](#global)
    - [Inside Repo](#inside-repo)
  - [Usage](#usage)
  - [Commmon Options](#commmon-options)
  - [Commands](#commands)
    - [Schema](#schema)
      - [Additional options](#additional-options)
    - [Typings](#typings)
      - [Additional options](#additional-options-1)
    - [Backend](#backend)
      - [Bootstrap](#bootstrap)
      - [Additional options](#additional-options-2)
      - [Models](#models)
        - [MongoDB](#mongodb)
      - [Resolvers](#resolvers)
  - [Frontend pages](#frontend-pages)
  - [Roadmap](#roadmap)

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
- you can get them from local config file
- complete them in interactive modes

In this order CLI will try to get argument.

## Commmon Options

All commands also take these options which refer to your GraphQL Editor project

| Option    | type   | description         |
| --------- | ------ | ------------------- |
| namespace | string | Your namespace name |
| project   | string | Project name        |
| version   | string | version name        |

## Commands

### Schema

Fetch schema from GraphQL Editor project. Schema will be compiled with GraphQL libraries you are using for this project

```sh
$ gecli schema
```

#### Additional options

| Option    | type   | description                       |
| --------- | ------ | --------------------------------- |
| schemaDir | string | Directory to generate schema file |

### Typings

Generate TypeScript or Javascript typings from GraphQL Editor project.

```sh
$ gecli typings
```

#### Additional options

| Option      | type                         | description                                 |
| ----------- | ---------------------------- | ------------------------------------------- |
| typingsDir  | string                       | Path where to store generated typings files |
| typingsGen  | "Javascript" or "TypeScript" | Generation language                         |
| typingsEnv  | "browser" or "node           | Environment for typings to work with        |
| typingsHost | string                       | GraphQL Server URL                          |

### Backend

#### Bootstrap

```sh
$ gecli bootstrap
```

Bootstrap a backend stucco project. It will create folder with `package.json` `stucco.json` and eslint and prettier configuration. It is an interactive command. It will create a folder with project name you will provide

#### Additional options

| Option | type                    | description          |
| ------ | ----------------------- | -------------------- |
| system | "backend" or "frontend" | Type of your project |

#### Models

```sh
$ gecli models
```

Generate TypeScript Models from GraphQL types. They are very useful to use with popular Databases

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

later on you may want to transform it so it is a database model.

```ts
import type { ModelTypes } from '@/zeus';
export type Person = Omit<ModelTypes['Person'], 'friends'> & { friends: string[] };
```

So you see the concept.

##### MongoDB

Here is an example how you can use your model in MongoDB.

```ts
db.collection<MyModel>.find({})
```

#### Resolvers

CLI tool to generate [Stucco](https://github.com/graphql-editor/stucco-js) resolvers in TypeScript from GraphQL fields.

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

It should generate TypeScript resolver placed in `$src/Query/people.ts`

```ts
import { FieldResolveInput, FieldResolveOutput } from 'stucco-js';
import { PersonCollection } from '../db/collections';
import { DB } from '../db/mongo';
import { Utils } from '../Utils';
import { Person, ResolverType, ValueTypes } from '../graphql-zeus';

export const handler = async (): Promise<FieldResolveOutput> => {};
```

and append correct entries to `stucco.json` file.

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
Some resolver types however need little code to make them work the way you want.

## Frontend pages

CLI tool to generate [GraphQL SSG](https://graphqlssg.com) Frontend Pages.

```sh
$ gecli bootstrap
```

## Roadmap

- [ ] Prisma models from GraphQL types interactive CLI
- [ ] More use cases with other databases and ORMs
- [ ] Deployment of microservices
- [ ] Add colours
- [ ] Push files to editor
- [ ] Generation of ejected microservices CI
