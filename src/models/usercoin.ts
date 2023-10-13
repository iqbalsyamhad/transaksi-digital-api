import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Store from './store';
import User from './user';

export interface UserCoinInterface {
    id?: number;
    userId: number;
    user?: User;
    coin: number;
    createdAt?: Date;
}

interface UserCoinCreationInterface extends Optional<UserCoinInterface, 'id'> { }

// Sequelize Model
@Table
export default class UserCoin extends Model<UserCoinInterface, UserCoinCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({ unique: 'useridcoin' })
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    coin: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}