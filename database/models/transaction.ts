import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Order, User } from '.';

class Transaction extends Model {
    declare id: number;
    declare user_id: number;
    declare transaction_amount: number;
    declare previous_balance: number;
    declare current_balance: number;
    declare reason: 'order' | 'admin';
    declare User?: User;
    declare Order?: Order;
    declare created_at: Date;
    declare updated_at: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
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
        transaction_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        previous_balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        current_balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        reason: {
            type: DataTypes.ENUM('admin', 'order'),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Transaction;
