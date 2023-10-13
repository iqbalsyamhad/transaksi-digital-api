import sequelize, { Optional } from 'sequelize';
import { AllowNull, BeforeUpdate, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface MemberTypeInterface {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    benefit?: string | null;
}

interface MemberTypeCreationInterface extends Optional<MemberTypeInterface, 'id'> { }

// Sequelize Model
@Table({
    tableName: 'MemberTypes'
})
export default class MemberType extends Model<MemberTypeInterface, MemberTypeCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    id: string;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    price: number;

    @AllowNull(false)
    @Default(null)
    @Column(DataType.TEXT)
    description: string;

    @AllowNull(false)
    @Default(null)
    @Column(DataType.TEXT)
    benefit: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}
