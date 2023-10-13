import sequelize, { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface RecoveryAccountInterface {
    id?: string;
    userId: number;
    user?: User;
    type: 'password' | 'pin';
    isUsed?: boolean;
    expired?: boolean;
    expireAt: string;
}

interface RecoveryAccountCreationInterface extends Optional<RecoveryAccountInterface, 'id'> { }

// Sequelize Model
@Table({
    tableName: 'RecoveryAccount'
})
export default class RecoveryAccount extends Model<RecoveryAccountInterface, RecoveryAccountCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Column(DataType.ENUM( 'password', 'pin'))
    type: 'password' | 'pin';

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isUsed: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    expired: boolean;

    @AllowNull(false)
    @Column(DataType.DATE)
    expireAt: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
