import dotenv from "dotenv";
import { buildServer } from "./server";
import { reportSchemas } from "./schemas/reportSchemas";

const app = buildServer();
dotenv.config();

for (const schema of reportSchemas) {
  app.addSchema(schema);
}

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`🚀 Server ready at ${address}`);
});
