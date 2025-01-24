import {
    GameService,
    JwtService,
    PrismaService,
} from "@/services";
import { asClass, createContainer, InjectionMode } from "awilix";
import "dotenv/config";
import Application from "./app";
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

// Register the services
container.register({
    // Register the Services
    Application: asClass(Application).singleton(),
    PrismaService: asClass(PrismaService).singleton(),
    JwtService: asClass(JwtService).singleton(),
    GameService: asClass(GameService).scoped(),
});
export default container

