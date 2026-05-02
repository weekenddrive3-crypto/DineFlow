import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KotsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement kots business logic
}
