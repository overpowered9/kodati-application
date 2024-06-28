import { User, Transaction, Order, Customer } from "@/database/models";
import { PaginatedStore, PaginatedStores } from '@/types/pagination-types';
import { sleep } from "./helpers";
import { Op, WhereOptions } from "sequelize";

export const getStores = async ({ query, page = 1, limit = 10 }: { query?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = { role: 'user' };

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause.id = id;
      } else {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ]
        }
      }
    }

    const { rows, count } = await User.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      attributes: ['id', 'name', 'provider', 'email', 'mobile'],
      include: {
        model: Transaction,
        attributes: ['current_balance'],
        order: [['created_at', 'DESC']],
        limit: 1,
      },
    });

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedStores;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getStore = async ({ id, query, page = 1, limit = 10 }: { id: number, query?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = {};

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause.id = id;
      } else {
        whereClause = {
          reason: { [Op.like]: `%${query}%` },
        }
      }
    }
    const user = await User.findByPk(id, {
      attributes: ['name'],
      include: [
        {
          model: Transaction,
          order: [['created_at', 'DESC']],
          attributes: {
            exclude: ['user_id', 'updated_at']
          },
          limit,
          where: whereClause,
          include: [{
            model: Order,
            attributes: ['id'],
            include: [{
              model: Customer,
              attributes: {
                exclude: ['created_at', 'updated_at'],
              }
            }]
          }],
          // @ts-ignore-next-line
          offset,
        }
      ]
    });

    await sleep(1000);

    if (!user) {
      return null;
    }

    const totalCount = await Transaction.count({
      where: {
        user_id: id,
        ...whereClause,
      },
    });

    return {
      user: user.toJSON() as User,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    } as PaginatedStore;

  } catch (error) {
    console.error(error);
    return null;
  }
};
