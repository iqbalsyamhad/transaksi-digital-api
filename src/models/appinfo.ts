import { Optional } from 'sequelize';
import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import constant from '../config/constant';

export interface AppInfoInterface {
    key: string;
    value: string;
    image?: string;
}

interface AppInfoCreationInterface extends Optional<AppInfoInterface, 'key'> { }

// Sequelize Model
@Table({ createdAt: false, updatedAt: false })
export default class AppInfo extends Model<AppInfoInterface, AppInfoCreationInterface> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.STRING)
    key: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    value: string;

    @AllowNull(true)
    @Default(null)
    @Column
    image: string;

    @Column(DataType.VIRTUAL(DataType.STRING))
    get imagePath(): string {
        let imageValue = this.getDataValue('image') || '';
        return imageValue.startsWith('http') ? imageValue : `${constant.baseUrl}/${constant.appInfoImagePath}/${imageValue}`;
    }
}