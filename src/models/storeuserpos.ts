import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Store from './store';
import User from './user';
import UserPos from './userpos';

export interface StoreUserPosInterface {
    id?: number;
    userPosId: number;
    userPos?: UserPos;
    storeId: number;
    store?: Store;
    role: 'cashier';
    createdAt?: Date;
}

interface StoreUserPosCreationInterface extends Optional<StoreUserPosInterface, 'id'> { }

// Sequelize Model
@Table
export default class StoreUserPos extends Model<StoreUserPosInterface, StoreUserPosCreationInterface> {
    @ForeignKey(() => UserPos)
    @AllowNull(false)
    @Column({ unique: 'uniquestoreuserpos' })
    userPosId: number;

    @BelongsTo(() => UserPos)
    userPos: UserPos

    @ForeignKey(() => Store)
    @AllowNull(false)
    @Column({ unique: 'uniquestoreuserpos' })
    storeId: number;

    @BelongsTo(() => Store)
    store: Store

    @AllowNull(false)
    @Column(DataType.ENUM('cashier'))
    role: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}