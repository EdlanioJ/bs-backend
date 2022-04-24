export class AuthPayloadDto {
  sub: string;

  username: string;

  role: string;

  constructor(payload: AuthPayloadDto) {
    Object.assign(this, payload);
  }
}
