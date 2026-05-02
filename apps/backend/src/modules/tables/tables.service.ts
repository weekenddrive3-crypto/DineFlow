import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement tables business logic
}
