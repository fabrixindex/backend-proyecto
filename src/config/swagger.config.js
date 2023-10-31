import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API CatsBook',
            description: 'Documentacion para uso de swagger!!'
        }
    },
    apis: [`./src/docs/**/*.yaml`]
  };
 
export const specs = swaggerJSDoc(swaggerOptions);