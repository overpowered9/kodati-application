import { AdminLinkedProduct, Product, Provider } from "@/database/models";
import { PaginatedProducts } from '@/types/pagination-types';
import { sleep } from "./helpers";

export const getAdminLinkedProducts = async ({ query, page = 1, limit = 10 }: { query?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: { id?: number } = {};

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause.id = id;
      }
    }

    const { rows, count } = await Product.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      attributes: {
        exclude: ['created_at', 'updated_at', 'image', 'image_type', 'title'],
      },
      include: [
        {
          model: AdminLinkedProduct,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
          required: true,
          include: [
            {
              model: Provider,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    await sleep(1000);

    const data = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as PaginatedProducts;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}
