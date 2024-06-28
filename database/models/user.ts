import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { MerchantLinkedProduct, Transaction, PasswordToken, EmailTemplate, Cart } from '.';

  class User extends Model {
    declare id: number;
    declare name: string | null;
    declare email: string;
    declare mobile: string | null;
    declare avatar: string | null;
    declare password: string;
    declare manager_token: string | null;
    declare access_token: string | null;
    declare refresh_token: string | null;
    declare access_token_created: Date | null;
    declare access_token_expired: Date | null;
    declare role: 'user' | 'admin';
    declare provider: 'salla' | 'zid' | null;
    declare metadata: Record<string, any> | null;
    declare Transactions?: Transaction[];
    declare MerchantLinkedProducts?: MerchantLinkedProduct[];
    declare EmailTemplate?: EmailTemplate;
    declare Cart?: Cart;
    declare createLog: (data: any) => Promise<any>;
    declare createOrder: (data: any) => Promise<any>;
    declare createPasswordToken: (data: any) => Promise<any>;
    declare createCart: (data?: any) => Promise<Cart>;
    declare createEmailTemplate: (data: any) => Promise<any>;
    declare createTransaction: (data: any) => Promise<any>;
    declare createNotification: (data: any) => Promise<any>;
    declare getPasswordToken: () => Promise<PasswordToken>;
    declare getEmailTemplate: () => Promise<EmailTemplate>;
    declare getCart: () => Promise<Cart | null>;
    declare created_at: Date;
    declare updated_at: Date;
  }

  User.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_token: {
      type: DataTypes.STRING(1500)
    },
    access_token: {
      type: DataTypes.STRING(1500)
    },
    refresh_token: {
      type: DataTypes.STRING(1500)
    },
    access_token_created: {
      type: DataTypes.DATE
    },
    access_token_expired: {
      type: DataTypes.DATE
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM('salla', 'zid')
    },
    metadata: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

export default User;