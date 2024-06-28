import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Card, Product } from '.';

class OrderItem extends Model {
  declare id: number;
  declare order_id: number;
  declare local_product_id: number;
  declare provider_product_id: string | null;
  declare quantity: number;
  declare amount: number;
  declare currency: string;
  declare status: string | null;
  declare Product?: Product;
  declare Cards?: Card[];
  declare update: (data: any) => Promise<any>;
  declare createCard: (data: any) => Promise<any>;
  declare created_at: Date;
  declare updated_at: Date;
}

OrderItem.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    onDelete: 'CASCADE',
    primaryKey: true,
    references: {
      model: 'orders',
      key: 'id',
    }
  },
  local_product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "products",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  provider_product_id: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  quantity: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default OrderItem;