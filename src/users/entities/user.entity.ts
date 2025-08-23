import { IsEmail, IsInt, IsNumber, Max, Min } from "class-validator";
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
    @IsEmail()
    email: string;

    @Column()
    @IsInt()
    @Min(16)
    @Max(120)
    age: number;

    @Column({type:"enum",enum: UserGender})
    gender: UserGender

    @Column({type: 'enum', default: UserRole.USER, enum: UserRole})
    role: UserRole;

    @Column( {nullable: false, select: false})
    password: string;

    @DeleteDateColumn()
    deletedAt: Date

}
