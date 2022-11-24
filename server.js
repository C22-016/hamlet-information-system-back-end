const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => 'Hello from HapiJS!',
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
