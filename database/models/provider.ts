import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import AdminLinkedProduct from './adminlinkedproduct';

class Provider extends Model {
  declare id: number;
  declare name: string;
  declare base_url: string;
  declare AdminLinkedProducts: AdminLinkedProduct[];
  declare created_at: Date;
  declare updated_at: Date;
}

Provider.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.ENUM('EZ PIN', 'Like Card'),
    allowNull: false,
    unique: true,
  },
  base_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  sequelize,
  modelName: 'Provider',
  tableName: 'providers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Provider;