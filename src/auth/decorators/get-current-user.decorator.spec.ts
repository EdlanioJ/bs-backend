/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Test } from '@nestjs/testing';
import { createRequest, createResponse } from 'node-mocks-http';

import { GetCurrentUser } from './get-current-user.decorator';

@Controller()
class TestController {
  getUser(@GetCurrentUser() user: any) {
    return user;
  }

  geUserSub(@GetCurrentUser('sub') sub: string) {
    return sub;
  }
}

function getParamDecoratorFactory(_decorator: any, param?: string) {
  class TestDecorator {
    public test(@GetCurrentUser(param) _value: any) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('GetCurrentUser', () => {
  let controller: TestController;
  const req = createRequest();
  const res = createResponse();

  const userMock = {
    sub: 'any_sub',
    username: 'any_username',
    role: 'any_role',
  };
  req.user = userMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();
    controller = module.get<TestController>(TestController);
  });

  it('should return user', async () => {
    const ctx = new ExecutionContextHost(
      [req, res],
      TestController,
      controller.getUser,
    );
    const factory = getParamDecoratorFactory(GetCurrentUser);
    const user = factory(null, ctx);
    const out = controller.getUser(user);
    expect(out).toEqual(req.user);
  });

  it('should return user sub', () => {
    const ctx = new ExecutionContextHost(
      [req, res],
      TestController,
      controller.geUserSub,
    );
    const factory = getParamDecoratorFactory(GetCurrentUser, 'sub');
    const sub = factory('sub', ctx);
    const out = controller.geUserSub(sub);
    expect(out).toEqual(req.user['sub']);
  });
});
