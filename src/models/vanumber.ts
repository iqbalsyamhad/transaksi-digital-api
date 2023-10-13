import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import MemberTypeTransaction from './membertypetransaction';
import User from './user';

export interface VANumberInterface {
    id?: number;
    vanumber: string;
    userId: number;
    user?: User;
    isOpenAmount: boolean;
    amount: number | null;
    expireAt?: Date | null;
    membertypeTransactionId: number | null;
    membertypeTransaction?: MemberTypeTransaction;
    deletedAt?: Date | null;
}

interface VANumberCreationInterface extends Optional<VANumberInterface, 'id'> { }

// Sequelize Model
@Table
export default class VANumber extends Model<VANumberInterface, VANumberCreationInterface> {
    @AllowNull(false)
    @Column({ unique: 'vanumberunique' })
    vanumber: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Column
    isOpenAmount: boolean

    @AllowNull(true)
    @Column(DataType.DOUBLE)
    amount: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    expireAt: Date;

    @ForeignKey(() => MemberTypeTransaction)
    @AllowNull(true)
    @Column
    membertypeTransactionId: number;

    @BelongsTo(() => MemberTypeTransaction)
    membertypeTransaction: MemberTypeTransaction

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}