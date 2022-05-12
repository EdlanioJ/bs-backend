export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'GOOGLE_CLIENT_ID':
        return 'googleClientId';
      case 'GOOGLE_CLIENT_SECRET':
        return 'googleClientSecret';
      case 'GOOGLE_CALLBACK_URL':
        return 'googleCallbackUrl';
      case 'JWT_SECRET':
        return 'jwtSecret';
      case 'JWT_REFRESH_SECRET':
        return 'jwtRefreshSecret';
    }
  },
};
