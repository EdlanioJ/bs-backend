export class AuthPayload {
  sub: string;

  username: string;

  role: string;

  constructor(payload: AuthPayload) {
    Object.assign(this, payload);
  }
}
