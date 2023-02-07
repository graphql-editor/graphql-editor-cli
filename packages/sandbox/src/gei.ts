import { NewIntegration } from "graphql-editor-cli";

// Declare your resolver specifications here to generate JSON from it later using `gei integrate` command
const integration = NewIntegration("gei-rest", {
  Query: {
    rest: {
      name: "dsda",
      description: "dsdsad",
      handler: () => {},
    },
  },
});

export default integration;
