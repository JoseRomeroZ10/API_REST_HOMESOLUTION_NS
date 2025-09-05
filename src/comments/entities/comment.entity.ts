import { RentalEntity } from "src/rentals/entities/rental.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment?: string

    @Column({type:'boolean', default:true})
     isActive: boolean;

    @Column({ nullable: true })
    deactivatedAt: Date;
    
    @ManyToOne(()=> UserEntity, (user)=> user.rentals)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: UserEntity

    @Column()
     user_id:number

    @ManyToOne(()=> RentalEntity, (rental)=> rental.comment)
    @JoinColumn({name: "rental_id", referencedColumnName: 'id'})
    rental: RentalEntity;

    @Column()
    rental_id: number
}
