import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface PaymentInterface {
    id?: number;
    ResponseCode: string;
    ResponseDescription: string;
    TransactionId: string;
    ProCode: string;
    MerchantId: string;
    CustomerNo: string;
    CustomerName: string;
    Amount: number;
    AdditionalData: string;
    FlagAmountCheck: number;
    ChannelId: string;
    TransactionDate: string;
}

interface PaymentCreationInterface extends Optional<PaymentInterface, 'id'> { }

// Sequelize Model
@Table
export default class Payment extends Model<PaymentInterface, PaymentCreationInterface> {
    @Column
    ResponseCode: string;

    @Column
    ResponseDescription: string;
    
    @Column
    TransactionId: string;
    
    @Column
    ProCode: string;
    
    @Column
    MerchantId: string;
    
    @Column
    CustomerNo: string;
    
    @Column
    CustomerName: string;
    
    @Column(DataType.DOUBLE)
    Amount: number;
    
    @Column
    AdditionalData: string;
    
    @Column
    FlagAmountCheck: number;
    
    @Column
    ChannelId: string;
    
    @Column
    TransactionDate: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}