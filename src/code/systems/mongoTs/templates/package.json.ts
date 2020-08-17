export const packageJson = ({ schemaURL }: { schemaURL: string }) => `{
    "name": "centaur-project",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "start": "stucco",
      "build": "tsc",
      "watch": "tsc --watch",
      "restart-database": "npm run rmdatabase && npm run database",
      "database": "docker run  -d --name mongo -p 27017:27017 mongo",
      "rmdatabase": "docker stop mongo && docker rm mongo",
      "schema": "zeus ${schemaURL} ./ -n -g ./ && npx zeus ${schemaURL} --ts ./src"
    },
    "author": "Centaur <centaur> (https://github.com/graphql-editor/centaur)",
    "license": "ISC",
    "devDependencies": {
      "@types/bson": "^4.0.0",
      "@types/mongodb": "^3.2.1",
      "@types/node": "^12.6.9",
      "@typescript-eslint/eslint-plugin": "^2.9.0",
      "@typescript-eslint/parser": "^2.9.0",
      "eslint": "^6.7.1",
      "eslint-config-prettier": "^6.7.0",
      "eslint-plugin-prettier": "^3.1.1",
      "graphql-zeus": "^2.4.1",
      "prettier": "^1.19.1",
      "ts-node": "^8.3.0",
      "typescript": "^3.7.2"
    },
    "dependencies": {
      "bson": "^4.0.2",
      "mongodb": "^3.3.5",
      "node-fetch": "^2.6.0",
      "stucco-js": "^0.1.2"
    }
  }`;
