export class TokensModel {
  accessToken: string;
  refreshToken: string;

  constructor(tokens: TokensModel) {
    Object.assign(this, tokens);
  }
}
