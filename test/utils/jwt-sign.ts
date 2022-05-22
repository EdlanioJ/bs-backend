import * as jwt from 'jsonwebtoken';

export const jwtSign = (data: any, secret: string) => {
  return jwt.sign(data, secret, { expiresIn: '1h' });
};
