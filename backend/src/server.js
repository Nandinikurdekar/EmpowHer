const app = require('./app');
const { env } = require('./config/env');
const { testConnection } = require('./config/db');

let server;

const startServer = async () => {
  try {
    await testConnection();

    server = app.listen(env.port, () => {
      console.log(`EmpowHer backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', () => {
  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log('Server closed');
  });
});
