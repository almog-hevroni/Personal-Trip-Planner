// server/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Trip Planner API",
      version: "1.0.0",
      description: "תיעוד API למערכת תכנון הטיולים",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // ישירות מתוך auth.js
};

const specs = swaggerJsdoc(options);

export const swaggerUi = swaggerUiExpress;
export { specs };
