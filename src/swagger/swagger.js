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
        //url: "http://159.89.98.34:5545",
        url: "https://mandev.onrender.com"
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
  },
  apis: [
    "src/swagger/article.docs.yaml",
    "src/swagger/sites.docs.yaml",
    "src/swagger/users.docs.yaml",
    "src/swagger/gmail.docs.yaml",
  ], // files containing annotations as above
});

export default swRouter.use("/docs", swUi.serve, swUi.setup(swagger));
