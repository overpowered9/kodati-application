import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { User } from '.';

class Log extends Model {
  declare id: number;
  declare user_id: number;
  declare action: string;
  declare details: string;
  declare status: string;
  declare type: string;
  declare User?: User;
  declare created_at: Date;
  declare updated_at: Date;
}

Log.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Log',
  tableName: 'logs',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Log;