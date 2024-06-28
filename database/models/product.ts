import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { AdminLinkedProduct, MerchantLinkedProduct, OrderItem } from '.';

class Product extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare image: Buffer;
  declare image_type: string;
  declare price: number;
  declare AdminLinkedProducts?: AdminLinkedProduct[];
  declare MerchantLinkedProducts?: MerchantLinkedProduct[];
  declare Categories?: any[];
  declare Regions?: any[];
  declare OrderItems?: OrderItem[];
  declare addCategories: (data: any) => Promise<any>;
  declare removeCategories: (data: any) => Promise<any>;
  declare addRegions: (data: any) => Promise<any>;
  declare removeRegions: (data: any) => Promise<any>;
  declare created_at: Date;
  declare updated_at: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    image_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2).UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Product;