const fs = require("fs");
const { Parser } = require("graphql-zeus");
module.exports = function(plop) {
  // create your generators here
  const Config = {
    schema: "schema.graphql",
    query: "Query",
    mutation: "Mutation"
  };
  const schemaFile = fs.readFileSync(Config.schema).toString();
  const parsedSchema = Parser.parse(schemaFile);
  const types = parsedSchema.nodes.filter(
    n =>
      n.data.type === "ObjectTypeDefinition" &&
      n.name !== Config.query &&
      n.name !== Config.mutation
  );
  const crudPrompts = [
    {
      type: "list",
      name: "type",
      choices: types.map(t => t.name),
      message: "Specify type"
    },
    {
      type: "input",
      name: "collection",
      message: "Specify collection name"
    },
    {
      type: "input",
      name: "pk",
      message: "Specify primary key"
    }
  ];
  const resolverPrompts = (operation, name) => [
    {
      type: "confirm",
      name: `${name}Resolver`,
      message: `Create ${name} resolver?`
    },
    {
      type: "list",
      name,
      message: `Specify ${name} resolver name`,
      choices: parsedSchema.nodes
        .find(n => n.name === operation)
        .args.map(n => n.name),
      when: answers => answers[`${name}Resolver`]
    }
  ];
  const oneInputCreateResolverPrompt = [
    ...resolverPrompts(Config.mutation, "create"),
    {
      type: "list",
      choices: answers =>
        parsedSchema.nodes
          .find(n => n.name === Config.mutation)
          .args.find(n => n.name === answers.create)
          .args.map(n => n.name),
      message: `Specify input name for resolver`,
      name: "input",
      when: answers => answers[`createResolver`]
    }
  ];
  const upsertResolverPrompt = resolverPrompts(Config.mutation, "upsert");
  const removeResolverPrompt = resolverPrompts(Config.mutation, "remove");
  const getByParamResolverPrompt = resolverPrompts(Config.query, "getByParam");
  const listFilterResolverPrompt = resolverPrompts(Config.query, "listFilter");

  plop.setGenerator("crud-mongo", {
    description: "Create crud queries",
    prompts: [
      ...crudPrompts,
      ...oneInputCreateResolverPrompt,
      ...upsertResolverPrompt,
      ...removeResolverPrompt,
      ...getByParamResolverPrompt,
      ...listFilterResolverPrompt
    ], // array of inquirer prompts
    actions: data => {
      const actions = [];
      if (data.create) {
        actions.push({
          type: "add",
          path: `src/mutation/${data.create}.ts`,
          templateFile: "plop-templates/mongo/crud/oneInputCreate.hbs"
        });
      }
      if (data.listFilter) {
        actions.push({
          type: "add",
          path: `src/query/${data.listFilter}.ts`,
          templateFile: "plop-templates/mongo/crud/listFilter.hbs"
        });
      }
      if (data.getByParam) {
        actions.push({
          type: "add",
          path: `src/query/${data.getByParam}.ts`,
          templateFile: "plop-templates/mongo/crud/getByParam.hbs"
        });
      }
      if (data.upsert) {
        actions.push({
          type: "add",
          path: `src/mutation/${data.upsert}.ts`,
          templateFile: "plop-templates/mongo/crud/upsert.hbs"
        });
      }
      if (data.remove) {
        actions.push({
          type: "add",
          path: `src/mutation/${data.remove}.ts`,
          templateFile: "plop-templates/mongo/crud/remove.hbs"
        });
      }
      if (data.collection) {
        actions.push({
          type: "append",
          path: `src/db/collections.ts`,
          unique: true,
          template: `export const {{collection}} = "{{collection}}"`
        });
      }
      return [
        ...actions,
        data => {
          const gafferFile = require("./gaffer.json");
          let gafferFileContent = {
            ...gafferFile,
            resolvers: {
              ...gafferFile.resolvers
            }
          };
          if (data.getByParam) {
            gafferFileContent.resolvers[
              `${Config.query}.${data.getByParam}`
            ] = {
              resolve: {
                name: `lib/query/${data.getByParam}`
              }
            };
          }
          if (data.listFilter) {
            gafferFileContent.resolvers[
              `${Config.query}.${data.listFilter}`
            ] = {
              resolve: {
                name: `lib/query/${data.listFilter}`
              }
            };
          }
          if (data.create) {
            gafferFileContent.resolvers[`${Config.mutation}.${data.create}`] = {
              resolve: {
                name: `lib/mutation/${data.create}`
              }
            };
          }
          if (data.upsert) {
            gafferFileContent.resolvers[`${Config.mutation}.${data.upsert}`] = {
              resolve: {
                name: `lib/mutation/${data.upsert}`
              }
            };
          }
          if (data.remove) {
            gafferFileContent.resolvers[`${Config.mutation}.${data.remove}`] = {
              resolve: {
                name: `lib/mutation/${data.remove}`
              }
            };
          }
          fs.writeFileSync(
            "./gaffer.json",
            JSON.stringify(gafferFileContent, null, 4)
          );
          return;
        }
      ];
    }
  });
  plop.setGenerator("resolver-mongo", {
    description: "Generate mongo resolver",
    prompts: [
      {
        type: "list",
        name: "operation",
        choices: [Config.query, Config.mutation],
        message: "Choose operation type"
      },
      {
        type: "list",
        name: "resolver",
        choices: answers =>
          parsedSchema.nodes
            .find(n => n.name === answers.operation)
            .args.map(n => n.name),
        message: "Choose resolver"
      }
    ],
    actions: []
  });
};
