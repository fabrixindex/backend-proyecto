# CatsBook e-commerce site

CatsBook es una empresa ficticia dedicada a la venta de notebooks fundada en 2023. El objetivo de este proyecto es la realizacion del backend de un e-commerce, siendo el mismo adaptable a multiples variedades de rubros. 

## Repositorio del Backend
Mira el repositorio del backend de su e-commerce en [este enlace](https://github.com/fabrixindex/backend-proyecto.git).

## Resumen del proyecto

### Acerca del proyecto

Documentación API (Swagger)
Para acceder a la documentación de la API utilizando Swagger, visita el siguiente enlace:

[Swagger API Documentation](https://backend-proyecto-production-8bf6.up.railway.app/apidocs)

### Desarrollado con
- Node.js
- Express.js
- MongoDB

### Dependencias

| Dependencia              | Descripción                                            | Versión       | Licencia         |
|--------------------------|--------------------------------------------------------|---------------|------------------|
| @faker-js/faker          | Biblioteca para generar datos falsos                  | ^8.0.2        | MIT              |
| bcrypt                   | Librería para hashing de contraseñas                   | ^5.1.0        | MIT              |
| commander                | Solución completa para la interfaz de línea de comandos | ^11.0.0    | MIT              |
| connect-flash            | Mensajes flash para Express                            | ^0.1.1        | MIT              |
| connect-mongo            | Almacenamiento de sesiones de MongoDB para Express    | ^5.0.0        | MIT              |
| cookie-parser            | Middleware para manejar cookies en Express            | ^1.4.6        | MIT              |
| cors                     | Middleware para habilitar CORS en Express              | ^2.8.5        | MIT              |
| cross-env                | Configuración de entorno multiplataforma               | ^7.0.3        | MIT              |
| dotenv                   | Carga variables de entorno desde un archivo            | ^16.3.1       | BSD-2-Clause     |
| express                  | Marco de aplicación web para Node.js                   | ^4.18.2       | MIT              |
| express-compression      | Middleware de compresión para Express                  | ^1.0.2        | MIT              |
| express-handlebars       | Sistema de plantillas para Express                     | ^7.0.7        | MIT              |
| express-routemap         | Mapa de rutas para Express                              | ^1.6.0        | MIT              |
| jsonwebtoken              | Implementación de JSON Web Tokens para Node.js         | ^9.0.1        | MIT              |
| mongoose                 | Biblioteca para modelar objetos MongoDB para Node.js   | ^7.4.2        | MIT              |
| mongoose-paginate-v2     | Paginación para Mongoose                               | ^1.7.1        | MIT              |
| multer                   | Middleware para manejar datos de formulario en Express  | ^1.4.5-lts.1  | MIT              |
| nodemailer               | Módulo para enviar correos electrónicos desde Node.js  | ^6.9.5        | MIT              |
| passport                 | Middleware de autenticación para Node.js               | ^0.6.0        | MIT              |
| passport-github2         | Estrategia GitHub para Passport.js                     | ^0.1.12       | MIT              |
| passport-jwt             | Estrategia JWT para Passport.js                        | ^4.0.1        | MIT              |
| passport-local           | Estrategia de autenticación local para Passport.js     | ^1.0.0        | MIT              |
| socket.io                | Biblioteca para aplicaciones en tiempo real basada en eventos | ^4.6.2 | MIT              |
| swagger-jsdoc            | Herramienta para generar documentación Swagger a partir de comentarios | ^6.2.8 | MIT |
| swagger-ui-express       | Middleware para servir la interfaz de usuario de Swagger en Express | ^5.0.0 | Apache-2.0 |
| winston                  | Registrador flexible para Node.js                      | ^3.10.0       | MIT              |


## Cómo obtener una copia local del proyecto

### Prerrequisitos
Asegúrate de contar con Node Package Manager (NPM) instalado en tu sistema. Si no lo tienes, puedes instalarlo utilizando el siguiente comando:

```bash
npm
npm install npm@latest -g

También se recomienda tener Nodemon instalado:

npm install -g nodemon

### Instalación

1. Solicita las credenciales de MongoDB, Github login y mailer con nuestro Centro de soporte.

2. Clona el repositorio utilizando Git:

```bash
git clone https://github.com/fabrixindex/backend-proyecto.git

3. Instala las dependencias del proyecto ejecutando el siguiente comando en la raíz del proyecto:

npm install

4. Agrega a la carpeta raíz del proyecto el archivo .env enviado por nuestro centro de soporte. Puedes utilizar un archivo de ejemplo sin información sensible, llamado .env.example.

Asegúrate de configurar correctamente las variables de entorno en el archivo .env para que la aplicación funcione correctamente en tu entorno.

¡Ahora estás listo para ejecutar y probar el proyecto localmente!

