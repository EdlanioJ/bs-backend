export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'GOOGLE_CLIENT_ID':
        return 'googleClientId';
      case 'GOOGLE_CLIENT_SECRET':
        return 'googleClientSecret';
      case 'GOOGLE_CALLBACK_URL':
        return 'googleCallbackUrl';
      case 'GOOGLE_MOBILE_CALLBACK_URL':
        return 'googleMobileCallbackUrl';
      case 'JWT_SECRET':
        return 'jwtSecret';
      case 'JWT_REFRESH_SECRET':
        return 'jwtRefreshSecret';
      case 'JWT_EXPIRES_IN':
        return '10s';
      case 'JWT_SECRET_EXPIRE_IN':
        return '1h';
    }
  },
};
