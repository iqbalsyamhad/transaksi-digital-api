import sequelize, { Optional } from 'sequelize';
import { AllowNull, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import MemberType from './membertype';
import User from './user';
import VANumber from './vanumber';

export interface MemberTypeTransactionInterface {
    id?: number;
    userId: number;
    user?: User;
    membertypeid: string;
    membertype?: MemberType;
    price: number;
    isPaid: boolean;
    vanumber?: VANumber;
}

interface MemberTypeTransactionCreationInterface extends Optional<MemberTypeTransactionInterface, 'id'> { }

// Sequelize Model
@Table({
    tableName: 'MemberTypeTransactions'
})
export default class MemberTypeTransaction extends Model<MemberTypeTransactionInterface, MemberTypeTransactionCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({ unique: 'uniqueusermt' })
    userId: number;

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => MemberType)
    @AllowNull(false)
    @Column({ unique: 'uniqueusermt' })
    membertypeid: string;

    @BelongsTo(() => MemberType)
    membertype: MemberType

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    price: number;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isPaid: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasOne(() => VANumber)
    vanumber: VANumber;
}
