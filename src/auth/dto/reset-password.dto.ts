import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../validators';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
