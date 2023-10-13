import sequelize, { Optional } from 'sequelize';
import { AfterBulkCreate, AfterCreate, AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';
import BankAccount from './bankaccount';
import Util from './util';
import constant from '../config/constant';
import { sendTokenFromTokenTransaction } from '../services/cryptoservice';
import TokenTransaction from './tokentransaction';

export interface WithdrawTransactionInterface {
    id?: number;
    userId: number;
    user?: User;
    bankAccountId: number;
    bankAccount?: BankAccount;
    amount: number;
    status?: 'waiting' | 'processing' | 'success' | 'failed';
    description?: string;
}

interface WithdrawTransactionCreationInterface extends Optional<WithdrawTransactionInterface, 'id'> { }

// Sequelize Model
@Table
export default class WithdrawTransaction extends Model<WithdrawTransactionInterface, WithdrawTransactionCreationInterface> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId: number;

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => BankAccount)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    bankAccountId: number;

    @BelongsTo(() => BankAccount)
    bankAccount: BankAccount;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    amount: number;

    @AllowNull(false)
    @Default('waiting')
    @Column(DataType.ENUM('waiting', 'processing', 'success', 'failed'))
    status: 'waiting' | 'processing' | 'success' | 'failed';

    @Column
    description?: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @AfterBulkCreate
    @AfterCreate
    static async decreaseToken(payload: WithdrawTransactionInterface, options: any) {
        const dbGasFee: number | undefined = await Util.findOne({
            where: { key: constant.gasFeeTokenValue }
        }).then(res => res?.value);
        if (!dbGasFee) throw new Error('Tidak dapat mendapatkan gas fee!');

        const tokentrx = await TokenTransaction.create({
            userId: payload.userId,
            trxOut: payload.amount,
            gasFeeIncluded: 0,
            gasFeeExcluded: dbGasFee
        }, {
            transaction: options.transaction
        });
        if (!tokentrx) throw new Error('Transaksi token gagal!');

        await sendTokenFromTokenTransaction(tokentrx.id, null, options.transaction, true);
    }
}