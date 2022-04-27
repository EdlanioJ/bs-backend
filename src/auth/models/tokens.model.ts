import { ApiProperty } from '@nestjs/swagger';

export class TokensModel {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(tokens: TokensModel) {
    Object.assign(this, tokens);
  }
}
