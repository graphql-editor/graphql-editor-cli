const logo = `
          {}{}  [ ]
          -''-.  |
        (\\  /\\) |
  ~______\\) | \`\\|
~~~(         |  '|)
  | )____(  |   |
  /|/     \` /|
  \\ \\      / |
  |\\|\\   /| |\\
Once you head down the centaur's path
forever will it dominate your destiny.
`;

export const welcome = (): Promise<void> =>
  new Promise((resolve) => {
    console.log(logo);
    resolve();
  });
