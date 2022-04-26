import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMailProducerService } from '../../mail/services';
import { UserRepository } from '../../user/repositories';
import { AuthHelpers } from '../helpers';

type Input = {
  email: string;
  password: string;
  name: string;
};

@Injectable()
export class RegisterService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authHelpers: AuthHelpers,
    private readonly mailProducer: SendMailProducerService,
  ) {}
  async execute({ email, name, password }: Input): Promise<void> {
    const user = await this.userRepo.findOneByEmail(email);
    if (user) throw new BadRequestException('User already exists');
    const hashedPassword = await this.authHelpers.hashData(password);
    const newUser = await this.userRepo.create({
      email,
      name,
      password: hashedPassword,
      avatar: 'default.png',
    });

    await this.mailProducer.execute(
      {
        to: newUser.email,
        type: 'welcome-email',
        content: [
          {
            key: 'name',
            value: newUser.name,
          },
        ],
      },
      { attempts: 3 },
    );
  }
}
