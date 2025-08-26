
import { UserRole } from "../../common/enums/user-role.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserGender } from "src/common/enums/user-gender.enum";


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
    active: boolean;

    @DeleteDateColumn()
    deletedAt: Date

}
