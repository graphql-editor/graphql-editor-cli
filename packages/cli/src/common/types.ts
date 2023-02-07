export interface StuccoConfig {
  resolvers: {
    [field: string]: {
      noCode?: {
        package: string;
        version: string;
      };
      resolve: {
        name: string;
      };
    };
  };
}
