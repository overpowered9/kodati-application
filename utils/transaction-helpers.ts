import { Customer, Order, Transaction, User } from '@/database/models';
import { PaginatedTransactions } from '@/types/pagination-types';
import { sleep } from './helpers';
import { Op } from 'sequelize';
import { isValidDate } from './client-helpers';

export const getLatestTransaction = async ({ user_id }: { user_id: number }) => {
  return await Transaction.findOne({
    attributes: ['current_balance', 'created_at'],
    order: [['created_at', 'DESC']],
    where: {
      user_id,
    },
  });
};

export const getTransactions = async ({ query, page = 1, limit = 10, role, user_id, startDate, endDate, sortOption }: { query?: string, page: number, limit?: number, role: 'admin' | 'user', user_id: number, startDate?: string, endDate?: string, sortOption?: string }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause = {};
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

    if (startDate && endDate) {
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('Invalid date format. Date must be in YYYY-MM-DD format.');
      }
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (parsedStartDate > parsedEndDate) {
        throw new Error('Start date cannot be greater than end date.');
      }
      whereClause = {
        ...whereClause,
        created_at: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      };
    }

    let order: [string, string][] = [['created_at', 'DESC']];

    if (sortOption === 'latest') {
      order = [['created_at', 'DESC']];
    } else if (sortOption === 'oldest') {
      order = [['created_at', 'ASC']];
    } else if (sortOption === 'highest') {
      order = [['transaction_amount', 'DESC']];
    } else if (sortOption === 'lowest') {
      order = [['transaction_amount', 'ASC']];
    }

    const { rows, count } = await Transaction.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      order,
      attributes: {
        exclude: ['updated_at', 'user_id']
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Order,
          attributes: ['id'],
          include: [{
            model: Customer,
            attributes: {
              exclude: ['created_at', 'updated_at'],
            }
          }]
        }
      ]
    });

    let currentBalance: number | null = null;
    if (role === 'user') {
      if (page === 1 && !query) {
        currentBalance = rows?.[0]?.current_balance ?? 0;
      } else {
        const latestTransaction = await getLatestTransaction({ user_id });
        currentBalance = latestTransaction?.current_balance ?? 0;
      }
    }

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentBalance,
    };

    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedTransactions;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}