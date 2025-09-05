import {Controller,Get,Post,  Body,Patch,Param,Delete,Query,UseGuards,} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { ActiveUser } from '../common/decorators/active_user.decorator';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { RentalsFilterDto } from '../common/dto/rental-filter.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createRentalDto: CreateRentalDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.rentalsService.create(createRentalDto, user);
  }

  @Get()
  findAll(@Query() filters: RentalsFilterDto) {
    return this.rentalsService.findAll(filters);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.rentalsService.findOne(id, user);
  }

   @Patch(':id')
    @UseGuards(AuthGuard)
   update(@Param('id') id: number, @Body() updateRentalDto: UpdateRentalDto, @ActiveUser() user: UserActiveInterface) {
     return this.rentalsService.update(id, updateRentalDto, user);
   }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
  return this.rentalsService.remove(id,user);
  }
 }
