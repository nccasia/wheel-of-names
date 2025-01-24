import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpecs = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Lucky-Wheel API",
            version: "1.0.0",
            description:
                "Lucky-Wheel API is a RESTful API for Lucky-Wheel Game",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.APP_PORT}/api/`,
            },
        ],
    },
    apis: ["./src/controllers/**/*.*s", "./src/models/**/*.*s",],
};

const options = {
    customSiteTitle: "Vietnamese King API",
};

const specs = swaggerJSDoc(swaggerSpecs);
export { options, specs };

