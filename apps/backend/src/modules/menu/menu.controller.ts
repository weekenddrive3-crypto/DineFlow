import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // TODO: Implement menu endpoints
}
