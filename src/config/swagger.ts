import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AKi - API Documentation',
      version: '1.0.0',
      description: 'Documentación de la API de Productos y Usuarios',
    },
    servers: [
      {
        // Usamos una ruta relativa o la variable de entorno para mayor flexibilidad
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Apuntamos a las rutas para que procese los comentarios JSDoc
  apis: [
    './src/routes/*.ts', 
    './dist/routes/*.js'
  ], 
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);