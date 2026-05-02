import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // TODO: Implement settings endpoints
}
