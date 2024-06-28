import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Provider } from '.';

class AdminLinkedProduct extends Model {
  declare local_product_id: number;
  declare provider_id: number;
  declare provider_product_id: number;
  declare min_price: number;
  declare max_price: number;
  declare currency_code: string;
  declare converted_price: number;
  declare Provider?: Provider;
  declare created_at: Date;
  declare updated_at: Date;
}

AdminLinkedProduct.init({
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
  provider_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'providers',
      key: 'id',
    },
  },
  provider_product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  min_price: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
  max_price: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
  currency_code: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  converted_price: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'AdminLinkedProduct',
  tableName: 'admin_linked_products',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default AdminLinkedProduct;