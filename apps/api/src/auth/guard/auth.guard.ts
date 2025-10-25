import { Injectable } from '@nestjs/common';
import { AuthGuard as PassaportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassaportAuthGuard('jwt') {}
