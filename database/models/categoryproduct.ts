import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class CategoryProduct extends Model {
  declare category_id: number;
  declare product_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

CategoryProduct.init({
  category_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
    references: {
      model: 'categories',
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
  modelName: 'CategoryProduct',
  tableName: 'category_product',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default CategoryProduct;