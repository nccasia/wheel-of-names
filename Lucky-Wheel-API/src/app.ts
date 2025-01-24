import { options, specs } from "@/configs/swagger";
import { loadControllers, scopePerRequest } from "awilix-express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import 'dotenv/config';
import { createServer, Server } from "http";
import swaggerUi from "swagger-ui-express";
import { corsConfig } from "./configs/corsConfig";
import { Environments } from "./constants/Environments";
import container from "./container";
import expressApp from "./server";

/**
 * Application class.
 * @description Handle init config and components.
 */
class Application {
  server: expressApp;
  serverInstance: Server;
  constructor() {
    this.initServer();
    if (!this.serverInstance) {
      this.start();
    }
  }

  private initServer() {
    this.server = new expressApp();
  }
  start() {
    ((port = process.env.APP_PORT || 5001) => {
      this.serverInstance = createServer(this.server.app).listen(port, () => {
          console.log(`Server running at http://localhost:${port}`);
        }) 
      this.server.app.use(cors(corsConfig));
      this.server.app.use(cookieParser());
      this.server.app.use(bodyParser.json());
      this.server.app.use(bodyParser.urlencoded({ extended: true }));
      this.server.app.use(scopePerRequest(container));
      if (process.env.NODE_ENV === Environments.DEVELOPMENT) {
        this.server.app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, options));
      }
      this.server.app.use("/api", loadControllers("./controllers/*.*s", { cwd: __dirname }));
    })();
  }
  close() {
    this.serverInstance.close();
  }
}
export default Application;