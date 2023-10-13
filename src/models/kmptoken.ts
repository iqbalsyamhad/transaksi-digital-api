import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AfterUpdate, AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import constant from '../config/constant';

export interface KMPTokenInterface {
    id: 'brankas' | 'revenue';
    token: number;
    walletPassword?: string;
    walletAddress?: string;
    walletStringify?: string;
    updatedAt?: Date | null;
}

interface KMPTokenCreationInterface extends Optional<KMPTokenInterface, 'id'> { }

// Sequelize Model
@Table
export default class KMPToken extends Model<KMPTokenInterface, KMPTokenCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.ENUM(constant.KMPBrankas, constant.KMPNettRevenue))
    id: 'brankas' | 'revenue';

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DOUBLE)
    token: number;

    @AllowNull(true)
    @Default(null)
    @Column
    walletPassword: string;

    @AllowNull(true)
    @Default(null)
    @Column
    walletAddress: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.TEXT)
    walletStringify: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}