> Once you head down the GraphQL's path
> forever will it dominate your destiny.

# GraphQL Editor Cli

Translate GraphQL to Anything and make it your one and only source of truth. Schema. Compatible with [GraphQL Editor](https://graphqleditor.com) projects( Free and Paid Tiers). So the main goal is to provide interactive experience creating GraphQL as a service.

- [GraphQL Editor Cli](#graphql-editor-cli)
  - [Installation](#installation)
    - [Global](#global)
    - [Inside Repo](#inside-repo)
  - [Usage](#usage)
  - [Commands](#commands)
    - [Schema](#schema)
    - [Typings](#typings)
    - [Backend](#backend)
      - [Bootstrap](#bootstrap)
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
npm i graphql-editor-cli
```

then use with npx for example or as a `package.json` script.

## Usage

All comands work in 3 ways. You can provide all arguments with flags, you can get them from local config file or complete them in interactive modes

## Commands

### Schema

Generate schema from GraphQL Editor project.

```sh
$ gecli schema
```

### Typings

Generate TypeScript or Javascript typings from GraphQL Editor project.

```sh
$ gecli typings
```

### Backend

#### Bootstrap

```sh
$ gecli bootstrap backend <project_name>
```

Bootstrap a backend stucco project. It will create folder with `package.json` `stucco.json` and eslint and prettier configuration.

#### Models

```sh
$ gecli backend models
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
$ gecli bootstrap frontend <project_name>
```

## Roadmap

- [ ] Prisma models from GraphQL types interactive CLI
- [ ] More use cases with other databases and ORMs
- [ ] Deployment of microservices
