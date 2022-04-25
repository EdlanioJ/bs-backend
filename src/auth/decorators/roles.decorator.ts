import { SetMetadata } from '@nestjs/common';

import { Role } from '../entities';
export const ROLES_METADATA_KEY = 'roles';

export const Roles = (...args: Role[]) => SetMetadata(ROLES_METADATA_KEY, args);
