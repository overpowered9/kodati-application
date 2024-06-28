import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class EmailTemplate extends Model {
  declare id: number;
  declare user_id: number;
  declare subject: string;
  declare body: string;
  declare created_at: Date;
  declare updated_at: Date;
}

EmailTemplate.init({
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
    references: {
      model: 'users',
      key: 'id',
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'EmailTemplate',
  tableName: 'email_templates',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default EmailTemplate;