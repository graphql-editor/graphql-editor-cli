![](centaur.jpg)

> Once you head down the centaur's path
> forever will it dominate your destiny.

# GraphQL Centaur

Translate GraphQL to Anything and make it your one and only source of truth. It is named centaur because you need to generate resolvers with this CLI and then add some edits to make them custom. 

CLI tool to generate MongoDB [Stucco](https://github.com/graphql-editor/stucco-js) Database Resolvers in TypeScript from GraphQL Schema. Compatible with [GraphQL Editor](https://graphqleditor.com) projects( Free and Paid Tiers). So the main goal is to provide interactive experience creating GraphQL as a service. 

Right now in its early beginnings.

- [GraphQL Centaur](#graphql-centaur)
  - [Installation](#installation)
    - [Global](#global)
    - [Inside Backend Repo](#inside-backend-repo)
  - [Usage](#usage)
  - [How it works](#how-it-works)
    - [Resolver generation](#resolver-generation)
  - [Available Resolvers](#available-resolvers)
    - [CRUD](#crud)
      - [Create](#create)
      - [Update](#update)
      - [List](#list)
      - [Get by parameter](#get-by-parameter)
      - [Remove](#remove)
    - [Common](#common)
      - [Pipe](#pipe)
      - [Resolver](#resolver)
      - [Rest](#rest)
    - [Source](#source)
    - [SourcedCRUD](#sourcedcrud)

## Installation

### Global

```sh
npm i -g graphql-centaur
```

### Inside Backend Repo

```sh
npm i graphql-centaur
```
then use with npx for example or as a `package.json` scrip.

## Usage

Centaur is an interactive tool to create GraphQL Resolvers connected to MongoDB compatible with [stucco](https://github.com/graphql-editor/stucco-js) hybrid Go and TypeScript backend( the core is a binary and you write in TS). To start using centaur navigate to your backend repository and run command
```sh
$ centaur
```

Available commands are:

`init` - create new backend project compatible with stucco in js/ts. First it will ask you to configure your project and the source of schema. Next you can create resolvers for your GraphQL Schema.

`code` - run Resolver generation. See below.


## How it works

### Resolver generation

First time when you generate a resolver `centaur` will also generate needed libraries for `collections` , `DB`, `Utils` and [graphql-zeus](https://github.com/graphql-editor/graphql-zeus) definitions

Given the following schema:

```graphql
type Person{
    firstName: String!
}
type Query{
    people: [Person]!
}
schema{
    query: Query
}
```

After chosing:
1. `Query`
2. `people`
3. `CRUD`
4. `listFilter`

It should generate TypeScript resolver placed in `$src/Query/people.ts`


```ts
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { PersonCollection } from "../db/collections";
import { DB } from "../db/mongo";
import { Utils } from "../Utils";
import { Person, ResolverType, ValueTypes } from "../graphql-zeus";

export const handler = async (): Promise<FieldResolveOutput> => {
    const db = await DB();
    const col = await db.collection(PersonCollection);
    return Utils.CursorToGraphQLArray<Person>(
        await col.find({}),
    );
};
```

and append correct entries to `stucco.json` file.

```json
{
    "resolvers":{
        "Query.people":{
            "resolve":{
                "name":"lib/Query/people"
            }
        }
    }
}
```

and after running `stucco` your resolver should work out of the box.

Some resolver types however need little code to make them work the way you want.

## Available Resolvers

Resolvers are split into following categories

### CRUD

#### Create
Create an object in your database and return it
#### Update
Update an object in your database and return it
#### List
List all objects of selected type
#### Get by parameter
Get object by parameter from the database
#### Remove
Remove object from the database and return true


### Common

#### Pipe
Pipe the arguments of the query as source for the next resolver
#### Resolver
Simple Resolver you need to write
#### Rest
Rest proxy resolvers for pointing to existing REST APIs

### Source
Resolver that receives source from the parent resolver
### SourcedCRUD
The same as CRUD, but also use source