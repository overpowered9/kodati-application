import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';

class Card extends Model {
  declare id: number;
  declare order_item_id: number;
  declare card_number: string;
  declare pin_code: string;
  declare claim_url: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

Card.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  order_item_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'order_items',
      key: 'id',
    }
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pin_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  claim_url: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  }
}, {
  sequelize,
  modelName: 'Card',
  tableName: 'cards',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Card;