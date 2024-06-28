import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class Notification extends Model {
  declare id: number;
  declare user_id: number;
  declare type: 'info' | 'warning' | 'error' | 'success';
  declare message: string;
  declare read: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

Notification.init({
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
  type: {
    type: DataTypes.ENUM('info', 'warning', 'error', 'success'),
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Notification;