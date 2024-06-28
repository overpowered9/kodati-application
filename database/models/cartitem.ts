import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import Product from './product';

class CartItem extends Model {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare Product: Product;
  declare created_at: Date;
  declare updated_at: Date;
}

CartItem.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  cart_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'carts',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default CartItem;