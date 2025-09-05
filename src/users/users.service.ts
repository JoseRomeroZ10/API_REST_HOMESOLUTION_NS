import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PaginationDto } from '../common/dto/pagination';
import { AllApiResponse } from '../common/interface/respose-api.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.save(createUserDto);
  }
  async findAll(paginationDto: PaginationDto,): Promise<AllApiResponse<UserEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.userRepository.count(),
        this.userRepository.find({ skip, take: limit }),
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new NotFoundException();
      }
      return {
        meta: {
          page,
          limit,
          lastPage,
          total,
        },
        data,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User Not Exist');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, requestId: number) {
    const user = await this.userRepository.update(id, updateUserDto)
    
    if(id !==  requestId ){
      throw new ForbiddenException("No puedes modificar otro user")
    }
    if(user.affected === 0){
      throw new BadRequestException('User Not Found')
    }
    
    return user
  }

  async remove(id: number): Promise<UpdateResult> {
    try {
      const user = await this.userRepository.update(
        { id },
        { IsActive: false },
      );
      if (user.affected === 0) {
        throw new BadRequestException('User Not Found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
