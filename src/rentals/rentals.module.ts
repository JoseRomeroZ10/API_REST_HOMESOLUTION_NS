import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalEntity } from './entities/rental.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
   imports: [TypeOrmModule.forFeature([RentalEntity]),UsersModule],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
