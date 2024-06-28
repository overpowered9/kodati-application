import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class ProductRegion extends Model {
  declare region_id: number;
  declare product_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

ProductRegion.init({
  region_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: 'regions',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: 'products',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'ProductRegion',
  tableName: 'product_region',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ProductRegion;