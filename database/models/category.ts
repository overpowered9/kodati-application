import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class Category extends Model {
  declare id: number;
  declare name: string;
  declare image: Buffer;
  declare image_type: string;
  declare Products: any[];
  declare created_at: Date;
  declare updated_at: Date;
}

Category.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
  image_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Category;