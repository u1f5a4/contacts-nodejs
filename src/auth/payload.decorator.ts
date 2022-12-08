import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PayloadType = { email: string; iat: number };

export const Payload = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1] as string;
    const tokenPayload = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(tokenPayload, 'base64').toString());
    return payload;
  },
);
