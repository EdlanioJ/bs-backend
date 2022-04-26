import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthPayloadDto } from '../dto/auth-payload.dto';
import { ValidateOAuthService } from '../services';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly validateOauthService: ValidateOAuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, payload: AuthPayloadDto) => void,
  ) {
    try {
      const { id, displayName, photos, emails, provider } = profile;

      const output = await this.validateOauthService.execute({
        thirdPartyId: id,
        avatar: photos[0].value,
        name: displayName,
        email: emails[0].value,
        provider,
      });

      const payload = new AuthPayloadDto({
        sub: output.id,
        username: output.username,
        role: output.role,
      });

      done(null, payload);
    } catch (error) {
      console.log('err:', { error });
      done(error, null);
    }
  }
}
