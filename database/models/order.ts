import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Customer, OrderItem, Transaction, User } from '.';

class Order extends Model {
  declare id: number;
  declare user_id: number;
  declare customer_id: number | null;
  declare transaction_id: number | null;
  declare status: 'processing' | 'approved' | 'shipped' | 'fulfilled' | 'failed';
  declare source: 'salla' | 'zid' | 'manual';
  declare OrderItems?: OrderItem[];
  declare User?: User;
  declare Transaction?: Transaction;
  declare Customer?: Customer;
  declare createOrderItem: (data: any) => Promise<any>;
  declare setTransaction: (data: any) => Promise<any>;
  declare setCustomer: (data: any) => Promise<any>;
  declare created_at: Date;
  declare updated_at: Date;
}

Order.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
  customer_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    defaultValue: null,
    onDelete: 'CASCADE',
    references: {
      model: 'customers',
      key: 'id',
    }
  },
  transaction_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    defaultValue: null,
    onDelete: 'CASCADE',
    references: {
      model: 'transactions',
      key: 'id',
    }
  },
  status: {
    type: DataTypes.ENUM('processing', 'approved', 'shipped', 'fulfilled', 'failed'),
    allowNull: false,
  },
  source: {
    type: DataTypes.ENUM('salla', 'zid', 'manual'),
    allowNull: false,
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Order;