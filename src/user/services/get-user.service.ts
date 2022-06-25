import { Injectable } from '@nestjs/common';
import { UserModel } from '../models';
import { UserRepository } from '../repositories';

type Input = {
  id: string;
};

type Output = UserModel;

@Injectable()
export class GetUserService {
  constructor(private readonly userRepo: UserRepository) {}
  async execute({ id }: Input): Promise<Output> {
    const user = await this.userRepo.findOne(id);

    return UserModel.map(user);
  }
}
