import { Card, Customer, Order, OrderItem, Transaction, User } from '@/database/models';
import { PaginatedOrders } from '@/types/pagination-types';
import { sleep } from './helpers';
import { Op, WhereOptions } from 'sequelize';
import { getLatestTransaction } from './transaction-helpers';

const success = ["fulfilled", "shipped"];

export const getOrdersSummary = async ({ user_id, role }: { user_id: number, role: 'user' | 'admin' }) => {
  try {
    let whereClause: WhereOptions<any> | undefined = undefined;
    let currentBalance: number | undefined = undefined;
    if (role === 'user') {
      whereClause = { user_id };
      const latestTransaction = await getLatestTransaction({ user_id });
      currentBalance = latestTransaction?.current_balance ?? 0;
    }

    const pendingOrders = await Order.count({
      where: {
        status: {
          [Op.or]: ["approved", "processing"],
        },
        ...whereClause,
      }
    });

    const completedOrders = await Order.count({
      where: {
        status: {
          [Op.or]: success,
        },
        ...whereClause,
      }
    });

    const allOrders = await Order.count({
      where: whereClause
    });

    let failedOrders: number | undefined = undefined;
    if (role === 'admin') {
      const lastSuccessfulOrder = await Order.findOne({
        attributes: ['created_at'],
        where: {
          status: {
            [Op.or]: success,
          },
        },
        order: [['created_at', 'DESC']],
      });

      if (lastSuccessfulOrder) {
        failedOrders = await Order.count({
          where: {
            status: {
              [Op.not]: success,
            },
            created_at: {
              [Op.gt]: lastSuccessfulOrder.created_at,
            },
          }
        });
      }
    }

    return { pendingOrders, completedOrders, allOrders, failedOrders, currentBalance };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getOrders = async ({ query, page = 1, limit = 10, role, user_id }: { query?: string, page: number, limit?: number, role: 'admin' | 'user', user_id: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = {};
    if (role === 'user') {
      whereClause = { user_id };
    }

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause = {
          ...whereClause,
          id,
        };
      }
    }

    const { rows, count } = await Order.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      attributes: {
        exclude: ['user_id', 'updated_at', 'transaction_id'],
      },
      order: [['created_at', 'DESC']],
      distinct: true,
      include: [
        {
          model: OrderItem,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
          include: [{
            model: Card,
            attributes: ['id', 'card_number', 'pin_code', 'created_at'],
            order: [['created_at', 'DESC']],
          }],
        },
        {
          model: User,
          attributes: ['name'],
          where: (query && isNaN(parseInt(query))) ? { name: { [Op.like]: `%${query}%` } } : undefined,
        },
        {
          model: Transaction,
          attributes: ['id', 'previous_balance', 'current_balance']
        },
        {
          model: Customer,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          }
        }
      ],
    });

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };

    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedOrders;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}