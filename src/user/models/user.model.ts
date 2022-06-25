import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createdAt: Date;

  static map(user: User): UserModel {
    return {
      id: user.id,
      avatar: user.avatar,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  static mapCollection(users: User[]): UserModel[] {
    return users.map(UserModel.map);
  }
}
