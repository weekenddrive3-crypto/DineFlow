import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KotsService } from './kots.service';

@ApiTags('Kots')
@Controller('kots')
export class KotsController {
  constructor(private readonly kotsService: KotsService) {}

  // TODO: Implement kots endpoints
}
