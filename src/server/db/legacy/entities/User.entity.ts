import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    isActive!: boolean
}
