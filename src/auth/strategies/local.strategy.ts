import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthPayloadDto } from '../dto';
import { ValidateWithCredentialsService } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly validateWithCredentials: ValidateWithCredentialsService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<AuthPayloadDto> {
    const output = await this.validateWithCredentials.execute({
      email: username,
      password,
    });

    return {
      role: output.role,
      sub: output.id,
      username: output.username,
    };
  }
}
