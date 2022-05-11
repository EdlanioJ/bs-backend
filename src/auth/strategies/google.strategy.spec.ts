import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { Profile } from 'passport-google-oauth20';
import { mockedConfigService } from '../../../test/mocks/services';
import { AuthPayloadDto } from '../dto';
import { ValidateOAuthService } from '../services';
import { GoogleStrategy } from './google.strategy';

jest.mock('../services');

const doneMock = jest.fn() as (error: Error, payload: AuthPayloadDto) => void;

const accessToken = '_accessToken';
const refreshToken = 'refreshToken';
const profile = {
  photos: [{ value: 'photo' }],
  emails: [{ value: 'email' }],
  id: 'id',
  displayName: 'displayName',
  provider: 'google',
} as Profile;

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let service: ValidateOAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        ValidateOAuthService,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    service = module.get<ValidateOAuthService>(ValidateOAuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should done return an error if validate oath service throws', async () => {
    const error = new Error('error');
    const spy = jest.spyOn(service, 'execute').mockRejectedValue(error);
    const req = createRequest();
    await strategy.validate(req, accessToken, refreshToken, profile, doneMock);
    expect(doneMock).toHaveBeenCalledWith(error, null);
    expect(spy).toHaveBeenCalledWith({
      thirdPartyId: profile.id,
      avatar: profile.photos[0].value,
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: profile.provider,
    });
  });
});