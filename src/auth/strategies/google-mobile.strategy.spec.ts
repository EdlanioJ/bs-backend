import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { Profile } from 'passport-google-oauth20';
import { mockedConfigService } from '../../../test/mocks/services';
import { AuthPayloadDto } from '../dto';
import { ValidateOAuthService } from '../services';
import { GoogleMobileStrategy } from './google-mobile.strategy';

jest.mock('@nestjs/config');
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

describe('GoogleMobileStrategy', () => {
  let strategy: GoogleMobileStrategy;
  let service: ValidateOAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleMobileStrategy,
        ValidateOAuthService,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<GoogleMobileStrategy>(GoogleMobileStrategy);
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

  it('should done returns a payload', async () => {
    const user = { id: 'id', username: 'username', role: 'role' };
    jest.spyOn(service, 'execute').mockResolvedValue(user);
    const req = createRequest();
    await strategy.validate(req, accessToken, refreshToken, profile, doneMock);
    expect(doneMock).toHaveBeenCalledWith(null, {
      sub: user.id,
      username: user.username,
      role: user.role,
    });
  });
});
