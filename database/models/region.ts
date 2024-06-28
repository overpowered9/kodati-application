import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class Region extends Model {
  declare id: number;
  declare name: string;
  declare code: string;
  declare Products: any[];
  declare created_at: Date;
  declare updated_at: Date;
}

Region.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Region',
  tableName: 'regions',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Region;