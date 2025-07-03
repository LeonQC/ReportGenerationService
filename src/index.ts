import dotenv from "dotenv";
import { buildServer } from "./server";

const app = buildServer();
dotenv.config();

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`🚀 Server ready at ${address}`);
});
