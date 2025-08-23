import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from '../common/decorators/pagination';
import { AllApiResponse } from '../common/interface/respose-api.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise <UserEntity> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<AllApiResponse<UserEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.userRepository.count(),
        this.userRepository.find({skip,take:limit}),
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new NotFoundException ()
      }
      return {
        meta: {
          page,
          limit,
          lastPage,
          total,
        },
        data

      }
    } catch (error) {
      throw new NotFoundException;
    }
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'role'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id})
    if (!user){
      throw new BadRequestException ("User Not Exist")
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
