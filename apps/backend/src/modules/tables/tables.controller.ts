import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TablesService } from './tables.service';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  // TODO: Implement tables endpoints
}
