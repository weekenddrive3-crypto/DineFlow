import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TablesModule } from './modules/tables/tables.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { KotsModule } from './modules/kots/kots.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MenuModule,
    OrdersModule,
    TablesModule,
    PaymentsModule,
    ReportsModule,
    SettingsModule,
    CustomersModule,
    InventoryModule,
    KotsModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
