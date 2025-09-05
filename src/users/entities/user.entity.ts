
import { UserRole } from "../../common/enums/user-role.enum";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserGender } from "../../common/enums/user-gender.enum";
import { RentalEntity } from "../../rentals/entities/rental.entity";
import { CommentEntity } from "src/comments/entities/comment.entity";
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true, nullable: false})

    email: string;

    @Column()
    age: number;

    @Column({type:"enum",enum: UserGender})
    gender: UserGender

    @Column({type: 'enum', default: UserRole.USER, enum: UserRole})
    role: UserRole;

    @Column()
    password: string;

    @Column({type:'boolean', default:false})
    IsActive: boolean;

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(()=> RentalEntity, (rental)=> rental.user)
    @JoinColumn({name: 'rental_id'})
    rentals: RentalEntity[]

    @OneToMany(()=> CommentEntity, (comment)=> comment.user)
    @JoinColumn({name: 'rental_id'})
    comment: CommentEntity[]
}

