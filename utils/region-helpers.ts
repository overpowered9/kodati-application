import { Region } from "@/database/models";
import { Op, WhereOptions } from "sequelize";
import { sleep } from "./helpers";
import { PaginatedRegions } from "@/types/pagination-types";

export const getRegions = async () => {
  try {
    const regions = await Region.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at'],
      }
    });
    const serialize = JSON.stringify(regions);
    const deserialize = JSON.parse(serialize) as Region[];
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getPaginatedRegions = async ({ query, page = 1, limit = 10 }: { query?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = undefined;

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause = { id };
      } else {
        whereClause = {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { code: { [Op.like]: `%${query}%` } },
          ]
        }
      }
    }

    const { rows, count } = await Region.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      attributes: {
        exclude: ['updated_at'],
      },
    });

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };

    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedRegions;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRegion = async ({ id }: { id: number }) => {
  try {
    const region = await Region.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at']
      },
    });
    return region?.toJSON() as Region ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};