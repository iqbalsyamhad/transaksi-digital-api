import { MemberStatus } from '@types';
import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasOne, Model, Table, UpdatedAt } from 'sequelize-typescript';

export interface UserPosInterface {
    id?: number;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    status: 'pending' | 'active' | 'suspend' | 'inactive';
}

interface UserPosCreationInterface extends Optional<UserPosInterface, 'id'> { }

@DefaultScope(() => ({
    attributes: { exclude: ['password'] }
}))

// Sequelize Model
@Table
export default class UserPos extends Model<UserPosInterface, UserPosCreationInterface> {
    @AllowNull(true)
    @Column
    name: string;

    @AllowNull(false)
    @Column({ unique: 'email' })
    email: string;

    @AllowNull(true)
    @Default(null)
    @Column({ unique: 'phoneNumber' })
    phoneNumber: string;

    @AllowNull(false)
    @Column
    password: string;

    @AllowNull(true)
    @Default('active')
    @Column(DataType.ENUM('pending', 'active', 'suspend', 'inactive'))
    status: MemberStatus;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}