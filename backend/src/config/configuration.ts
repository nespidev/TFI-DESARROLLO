export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  prefix: process.env.GLOBAL_PREFIX || 'api',
  swaggerHabilitado: process.env.SWAGGER_HABILITADO === 'true',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || '',
    logging: process.env.DB_LOGGING === 'true',
    logger: process.env.DB_LOGGER || 'advanced-console',
  },
});
