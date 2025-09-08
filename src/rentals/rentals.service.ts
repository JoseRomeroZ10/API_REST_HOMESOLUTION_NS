import {BadRequestException,Injectable,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { RentalEntity } from './entities/rental.entity';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { RentalsFilterDto } from '../common/dto/rental-filter.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(RentalEntity)
    private readonly rentalsRepository: Repository<RentalEntity>,
  ) {}

  async create(
    createRentalDto: CreateRentalDto,user: UserActiveInterface): Promise<RentalEntity> {
    const rental = this.rentalsRepository.create({
      ...createRentalDto,
      user: {
        id: user.sub,
        email: user.email,
      },
    });

    return await this.rentalsRepository.save(rental);
  }

  async findAll(filters: RentalsFilterDto) {
    const { limit, page } = filters;
    const skip = (page - 1) * limit;

    const { minPrice, maxPrice, TypeRental } = filters;

    const query = this.rentalsRepository.createQueryBuilder('rental');

    if (minPrice !== undefined) {
      query.andWhere('rental.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('rental.price <= :maxPrice', { maxPrice });
    }

    if (filters.TypeRental) {
      query.andWhere('rental."TypeRental" = :TypeRental', {
        TypeRental: filters.TypeRental,
      });
    }
    const total = await query.getCount();

    const data = await query
      .skip(skip)
      .take(limit)
      .orderBy('rental.price', 'ASC')
      .getMany();

    const lastPage = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        lastPage,
        total,
      },
      data,
    };
  }
  async findOne(id: number, user: UserActiveInterface): Promise<RentalEntity> {
    const rental = await this.rentalsRepository.findOneBy({ id });

    if (!rental) {
      throw new BadRequestException('Rental Not Found');
    }
    this.validateOwnership(rental, user);
    return rental;
  }

  async update(
    id: number,updateRentalDto: UpdateRentalDto,user: UserActiveInterface,): Promise<UpdateResult> {
    await this.findOne(id, user);

    return await this.rentalsRepository.update(id, {
      ...updateRentalDto,
      user_id: user.sub,
    });
  }

  async remove(id: number, user: UserActiveInterface): Promise<UpdateResult> {
    await this.findOne(id, user);
    return await this.rentalsRepository.update(id, {
      isActive: false,
      deactivatedAt: new Date(),
    });
  }

  // Funciones adicionales al Crud

  private validateOwnership(rental: RentalEntity, user: UserActiveInterface) {
    if (rental.user_id !== user.sub) {
      throw new UnauthorizedException('No estas autorizado');
    }
  }
}
