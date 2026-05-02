import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement inventory business logic
}
