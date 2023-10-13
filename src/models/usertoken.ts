import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Store from './store';
import User from './user';

export interface UserTokenInterface {
    id?: number;
    userId: number;
    user?: User;
    token: number;
    createdAt?: Date;
}

interface UserTokenCreationInterface extends Optional<UserTokenInterface, 'id'> { }

// Sequelize Model
@Table
export default class UserToken extends Model<UserTokenInterface, UserTokenCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({ unique: 'useridtoken' })
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    token: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}