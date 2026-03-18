import { app } from "./app.ts";
import { config } from "./config.ts";
import { connectDatabase } from "./db.ts";

async function startServer() {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      console.log(`API running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();
