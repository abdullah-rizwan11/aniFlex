import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    fullname: string

    @Column({unique: true})
    email: string

    @Column()
    password: string
}

export default User;