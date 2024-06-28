import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class MerchantLinkedProduct extends Model {
  declare local_product_id: number;
  declare merchant_id: number;
  declare provider_product_id: string;
  declare created_at: Date;
  declare updated_at: Date;
}

MerchantLinkedProduct.init({
  local_product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: 'products',
      key: 'id',
    },
  },
  merchant_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
    }
  },
  provider_product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'MerchantLinkedProduct',
  tableName: 'merchant_linked_products',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default MerchantLinkedProduct;