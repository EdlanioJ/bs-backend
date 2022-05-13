import { validate } from 'class-validator';
import { Match } from './match.validator';

class TestDto {
  password: string;

  @Match('password', { message: 'Password does not match' })
  confirmPassword: string;
}

describe('Match', () => {
  it('should return no error', async () => {
    const dto = new TestDto();
    dto.password = '123456';
    dto.confirmPassword = '123456';
    const errors = await validate(dto);
    expect(errors).toEqual([]);
  });

  it('should return error', async () => {
    const dto = new TestDto();
    dto.password = '123456';
    dto.confirmPassword = '1234567';
    const errors = await validate(dto);
    console.log(errors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(
      expect.objectContaining({
        property: 'confirmPassword',
        constraints: {
          Match: 'Password does not match',
        },
      }),
    );
  });
});
