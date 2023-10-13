import { LocationGeometry, MemberStatus } from '@types';
import { Optional } from 'sequelize';
import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, DefaultScope, DeletedAt, ForeignKey, HasOne, Model, Table, UpdatedAt } from 'sequelize-typescript';
import constant from '../config/constant';
import LoginAttemp from './loginattemp';
import MemberType from './membertype';
import UserCoin from './usercoin';
import UserToken from './usertoken';

interface UserCreationInterface extends Optional<Express.User, 'id'> { }

@DefaultScope(() => ({
    attributes: { exclude: ['password', 'pin', 'latitude', 'longitude', 'geometry', 'walletPassword', 'walletAddress', 'walletStringify'] }
}))

// Sequelize Model
@Table
export default class User extends Model<Express.User, UserCreationInterface> {
    @AllowNull(false)
    @Column
    nik: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get ktpPath(): string {
        const imageValue = this.getDataValue('nik') || '';
        const initValue = require('randomstring').generate({ length: 16, charset: 'alphanumeric', capitalization: 'lowercase' });
        const chipper = require('crypto').createCipheriv('aes-256-cbc', process.env.ENCRYPT_KEY || 'secret', initValue);
        let encrypted = chipper.update(`${constant.ktpImagePath}/${imageValue}`, "utf-8", "hex");
        encrypted += chipper.final("hex");
        return `${constant.baseUrl}/v1/assets/${initValue}/${encrypted}.jpg`;
    }

    @AllowNull(false)
    @Column
    name: string;

    @Column
    image: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get imagePath(): string {
        let imageValue = this.getDataValue('image') || '';
        return imageValue.startsWith('http') ? imageValue : `${constant.baseUrl}/${constant.userImagePath}/${imageValue}`;
    }

    @AllowNull(false)
    @Column({ unique: 'email' })
    email: string;

    @AllowNull(true)
    @Default(null)
    @Column({ unique: 'phoneNumber' })
    phoneNumber: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DATEONLY)
    birthdate: Date;

    @AllowNull(false)
    @Column
    password: string;

    @AllowNull(true)
    @Default(null)
    @Column
    pin: string;

    @AllowNull(true)
    @Default(null)
    @Column
    city: string;

    @AllowNull(true)
    @Default(null)
    @Column
    province: string;

    @AllowNull(true)
    @Default(null)
    @Column
    subdistrict: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.TEXT)
    address: string;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    latitude: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.DOUBLE)
    longitude: number;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.GEOMETRY)
    geometry: LocationGeometry;

    @ForeignKey(() => MemberType)
    @AllowNull(true)
    @Default(null)
    @Column
    membertype: string;

    @BelongsTo(() => MemberType)
    membertypeinfo: MemberType

    @AllowNull(true)
    @Default(null)
    @Column(DataType.ENUM('operation', 'superadmin'))
    role: 'operation' | 'superadmin';

    @AllowNull(true)
    @Default('active')
    @Column(DataType.ENUM('pending', 'active', 'suspend', 'inactive'))
    status: MemberStatus;

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

    @HasOne(() => LoginAttemp)
    loginattemp: LoginAttemp

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    @HasOne(() => UserToken)
    tokenWallet: UserToken

    @HasOne(() => UserCoin)
    coinWallet: UserCoin
}