import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { User } from '.';

class PasswordToken extends Model {
  declare user_id: number;
  declare token: string;
  declare expiry: Date;
  declare getUser: () => Promise<User>;
  declare created_at: Date;
  declare updated_at: Date;
}

PasswordToken.init({
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    onDelete: 'CASCADE',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PasswordToken',
  tableName: 'password_tokens',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default PasswordToken;