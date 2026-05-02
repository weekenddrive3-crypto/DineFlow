import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // TODO: Implement customers endpoints
}
