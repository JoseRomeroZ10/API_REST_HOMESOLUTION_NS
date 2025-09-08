import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalEntity } from './entities/rental.entity';

@Module({
   imports: [TypeOrmModule.forFeature([RentalEntity]),],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
