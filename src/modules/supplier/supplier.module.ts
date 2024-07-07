import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
