import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Review of Movies',
      version: '1.0.0',
      description: "Document for a API REST",
    },
    servers: [
        {
          url: "http://localhost:3000/api/v1", // URL base de la API
        },
      ],
  },
  apis: ['swagger_auth.yml', 'swagger_user.yml', 'swagger_movie.yml', 'swagger_review.yml'],
};

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;