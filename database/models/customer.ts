import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class Customer extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare mobile: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Customer.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Customer',
  tableName: 'customers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Customer;