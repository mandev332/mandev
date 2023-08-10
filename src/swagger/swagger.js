import swUi from "swagger-ui-express";
import swJsDoc from "swagger-jsdoc";
import { Router } from "express";
const PORT = process.env.PORT || 5050;

const swRouter = Router();

const swagger = swJsDoc({
    swaggerDefinition: {
        openapi: "3.0.0",
        servers: [
            {
                url: "http://localhost:5545",
                variables: {
                    port: {
                        enum: [PORT],
                    },
                },
            },
        ],
        info: {
            title: "DEMO DATAS",
            version: "1.0.0",
            description: `Ma'lumotlar ustida amal bajarish uchun tekin API`,
        },
        components: {
            securitySchemes: {
                Token: {
                    type: "apiKey",
                    name: "token",
                    in: "header",
                    description: "access_token",
                },
            },
        },
    },
    apis: [
        "swagger/article.docs.yaml",
        "swagger/sites.docs.yaml",
        "swagger/users.docs.yaml",
        "swagger/gmail.docs.yaml",
    ], // files containing annotations as above
});

export default swRouter.use("/docs", swUi.serve, swUi.setup(swagger));
