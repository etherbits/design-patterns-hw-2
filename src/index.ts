import { App } from "./app";

async function main() {
  const app = await new App().default();
  await app.run();
}

main();