import { Category } from "@/database/models";
import { sleep } from "./helpers";
import { PaginatedCategories } from "@/types/pagination-types";
import { Op, WhereOptions } from "sequelize";

export const getCategories = async (image: boolean) => {
  try {
    const exclude = ['created_at', 'updated_at'];
    if (!image) {
      exclude.push('image', 'image_type');
    }
    const categories = await Category.findAll({
      attributes: {
        exclude,
      },
      order: [['created_at', 'DESC']],
    });
    await sleep(1000);
    const serialize = JSON.stringify(categories);
    const deserialize = JSON.parse(serialize) as Category[];
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getPaginatedCategories = async ({ query, page = 1, limit = 10 }: { query?: string, page: number, limit?: number }) => {
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
          ]
        }
      }
    }

    const { rows, count } = await Category.findAndCountAll({
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
    const deserialize = JSON.parse(serialize) as PaginatedCategories;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getCategory = async ({ id }: { id: number }) => {
  try {
    const category = await Category.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at', 'image', 'image_type']
      },
    });
    return category?.toJSON() as Category ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};