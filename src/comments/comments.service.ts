import {BadRequestException,Injectable,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { UserActiveInterface } from '../common/interface/user-active.interface';
import { RentalEntity } from '../rentals/entities/rental.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(RentalEntity)
    private readonly rentalRepository: Repository<RentalEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: UserActiveInterface,
    rental_id: number,
  ): Promise<CommentEntity> {
    if (!user?.sub) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const rental = await this.rentalRepository.findOneBy({ id: rental_id });
    if (!rental) {
      throw new BadRequestException('Rental no encontrado');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user_id: user.sub,
      rental_id: rental_id,
    });

    return await this.commentRepository.save(comment);
  }

  async findAll(createCommentDto: CreateCommentDto, user: UserActiveInterface) {
    return await this.commentRepository.find();
  }

  async findOne(id: number, user: UserActiveInterface): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      throw new BadRequestException('Comment Not Found');
    }
    this.validateOwnershipUser(comment, user);
    return comment;
  }

  async update(id: number,updateCommentDto: UpdateCommentDto,user: UserActiveInterface,rental_id: number): Promise<UpdateResult> {

    const comment = await this.rentalRepository.findOneBy({ id: rental_id });
    if (!comment) {
      throw new BadRequestException('Comentario no encontrado');
    }
    await this.findOne(id, user);

    return await this.commentRepository.update(id, {
      ...updateCommentDto,
      user_id: user.sub,
    });
  }

  async remove(id: number,user: UserActiveInterface,rental_id: number): Promise<UpdateResult> {
    
    const comment = await this.rentalRepository.findOneBy({ id: rental_id });
    if (!comment) {
      throw new BadRequestException('Comentario no encontrado');
    }
    await this.findOne(id, user);
    return await this.commentRepository.update(id, {
      isActive: false,
      deactivatedAt: new Date(),
    });
  }

  // Funciones adicionales al Crud

  private validateOwnershipUser(
    comment: CommentEntity,
    user: UserActiveInterface,
  ) {
    console.log(comment.user_id);
    if (comment.user_id !== user.sub) {
      throw new UnauthorizedException('No estas autorizado');
    }
  }

  async findAllByRental(rental_id: number): Promise<CommentEntity[]> {
    return await this.commentRepository.findBy({ rental_id });
  }
}
