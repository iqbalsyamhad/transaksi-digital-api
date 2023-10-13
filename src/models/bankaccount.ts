import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface BankAccountInterface {
    id?: number;
    userId: number;
    user?: User;
    name: string;
    number: string;
}

interface BankAccountCreationInterface extends Optional<BankAccountInterface, 'id'> { }

// Sequelize Model
@Table
export default class BankAccount extends Model<BankAccountInterface, BankAccountCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Column
    name: string;
    
    @AllowNull(false)
    @Column({ unique: 'accountNumber' })
    number: string;
    
    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}