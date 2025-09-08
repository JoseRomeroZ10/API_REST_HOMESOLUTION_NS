import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommentEntity } from '../../comments/entities/comment.entity';
import { TypeRentals } from '../../common/enums/type-rental.enum';
import { UserEntity } from '../../users/entities/user.entity';
@Entity()
export class RentalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  location: string;

  @Column()
  photo: string;

  @Column({ type: 'enum', enum: TypeRentals })
  TypeRental: TypeRentals;

  @Column({type:'boolean', default:true})
  available: boolean;

  @Column({type:'boolean', default:true})
  isActive: boolean;

  @Column({ nullable: true })
  deactivatedAt: Date;

  @ManyToOne(()=> UserEntity, (user)=> user.rentals)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: UserEntity

  @Column()
  user_id:number

  @OneToMany(()=> CommentEntity, (comment)=> comment.user)
      @JoinColumn({name: 'rental_id'})
      comment: CommentEntity[]


}
