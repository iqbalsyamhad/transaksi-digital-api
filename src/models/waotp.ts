import sequelize, { Optional } from 'sequelize';
import { AllowNull, Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

export interface WaOtpInterface {
    id?: string;
    phoneNumber: string;
    otp: string;
    validated: boolean;
    updatedAt?: Date;
}

interface WaOtpCreationInterface extends Optional<WaOtpInterface, 'id'> { }

// Sequelize Model
@Table({
    tableName: 'WaOTP'
})
export default class WaOtp extends Model<WaOtpInterface, WaOtpCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @AllowNull(false)
    @Column({ unique: 'phoneNumberOtp' })
    phoneNumber: string;

    @AllowNull(false)
    @Column
    otp: string;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    validated: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
