export enum ConfigKeys {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  IS_PRODUCTION = 'IS_PRODUCTION',
  RESET_SERVICE_URL = 'RESET_SERVICE_URL',
  JWT_SECRET = 'jwt.secret',
  JWT_EXPIRES_IN = 'jwt.expiresIn',
  JWT_ISSUER = 'jwt.issuer',
  REFRESH_TOKEN_EXPIRES_IN = 'refreshToken.expiresIn',
  RESET_TOKEN_EXPIRES_IN = 'resetToken.expiresIn',
}

export default () => {
  return {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    jwt: {
      issuer: 'eridu',
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    },
    refreshToken: {
      expiresIn: 1, // day
    },
    resetToken: {
      expiresIn: 1, // hour
    },
  };
};
