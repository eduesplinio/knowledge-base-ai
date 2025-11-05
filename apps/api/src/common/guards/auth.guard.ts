import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: { 'x-user-id'?: string };
      userId?: string;
    }>();
    const userId = request.headers['x-user-id'];

    if (!userId || !isValidObjectId(userId)) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    request.userId = userId;
    return true;
  }
}
