import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface LoginAttempInterface {
    userId: number;
    count: number;
    nextTry: Date | null;
}

interface LoginAttempCreationInterface extends Optional<LoginAttempInterface, 'userId'> { }

// Sequelize Model
@Table({
    tableName: 'LoginAttemps'
})
export default class LoginAttemp extends Model<LoginAttempInterface, LoginAttempCreationInterface> {
    @PrimaryKey
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId: number;

    @BelongsTo(() => User)
    user: User

    @AllowNull(false)
    @Default(0)
    @Column
    count: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATE)
    nextTry: Date | null;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}
