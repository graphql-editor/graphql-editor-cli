export default (integrationName: string) => `
on:
  push:
    tags:
      - "[0-9]+.[0-9]+.[0-9]+"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # Setup .npmrc file to publish to npm
      - uses: actions/setup-node@v1
        with:
          node-version: "16.x"
          registry-url: "https://registry.npmjs.org"
      - run: npm install
      - run: npm run build -w ${integrationName}
      - run: npm publish --access public --tag latest -w ${integrationName}
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_AUTH_TOKEN }}
`;
