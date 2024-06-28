import { Log, User } from "@/database/models";
import { PaginatedLogs } from '@/types/pagination-types';
import { sleep } from "./helpers";

export const getLogs = async ({ query, page = 1, limit = 10 }: { query?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: { id?: number } = {};

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause.id = id;
      }
    }

    const { rows, count } = await Log.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['updated_at'],
      },
      include: {
        model: User,
        attributes: ['name', 'email']
      },
    });

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedLogs;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}
