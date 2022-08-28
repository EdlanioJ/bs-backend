import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleMobileGuard extends AuthGuard('google-mobile') {}
