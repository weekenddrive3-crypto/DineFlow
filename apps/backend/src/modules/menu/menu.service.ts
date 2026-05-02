import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement menu business logic
}
