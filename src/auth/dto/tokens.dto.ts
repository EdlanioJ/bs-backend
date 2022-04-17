export class Tokens {
  access_token: string;

  refresh_token: string;

  constructor(tokens: Tokens) {
    Object.assign(this, tokens);
  }
}
