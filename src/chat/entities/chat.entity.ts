import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export class Chat {}
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
