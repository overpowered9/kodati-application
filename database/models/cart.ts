import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import CartItem from './cartitem';

class Cart extends Model {
  declare id: number;
  declare user_Id: number;
  declare CartItems?: CartItem[];
  declare createCartItem: (data: any) => Promise<any>;
  declare created_at: Date;
  declare updated_at: Date;
}

Cart.init(
  {
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
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Cart;