import { AdminLinkedProduct, Category, MerchantLinkedProduct, OrderItem, Product, Provider, Region } from '@/database/models';
import { PaginatedProducts } from '@/types/pagination-types';
import { sleep } from './helpers';
import { Op, type Includeable, WhereOptions } from 'sequelize';

export const getProducts = async ({ query, page = 1, limit = 10, category, region }: { query?: string, page?: number, limit?: number, category?: string, region?: string }) => {
  try {
    let whereClause: WhereOptions<any> | undefined = undefined;

    if (query) {
      const id = parseInt(query);
      if (!isNaN(id)) {
        whereClause = { id };
      } else {
        whereClause = {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ]
        }
      }
    }

    const include: Includeable[] = [
      {
        model: OrderItem,
        attributes: ['order_id'],
      }
    ];

    if (category) {
      include.push({
        model: Category,
        attributes: ['id'],
        through: {
          attributes: []
        },
        where: {
          name: category,
        },
        required: true,
      });
    }

    if (region) {
      include.push({
        model: Region,
        attributes: [['id', 'value'], ['name', 'label']],
        through: {
          attributes: []
        },
        where: {
          name: region,
        },
        required: true,
      });
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      attributes: {
        exclude: ['updated_at'],
      },
      limit,
      offset,
      where: whereClause,
      order: [['created_at', 'DESC']],
      include,
      distinct: true,
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
};

export const filterProductsByMerchantLinking = async ({ user_id, linked, page = 1, limit = 5 }: { user_id: number, linked?: boolean, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = undefined;
    whereClause = linked ? undefined : {
      '$MerchantLinkedProducts.local_product_id$': null
    }

    const { rows, count } = await Product.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['updated_at'],
      },
      include: {
        model: MerchantLinkedProduct,
        required: linked,
        attributes: ['provider_product_id', 'local_product_id'],
        where: {
          merchant_id: user_id,
        }
      },
      limit,
      offset,
      subQuery: false,
      order: [['created_at', 'DESC']],
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
};

export const filterProductsByAdminLinking = async ({ linked = true, page = 1, limit = 5 }: { linked?: boolean, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = undefined;
    whereClause = linked ? undefined : {
      '$AdminLinkedProducts.local_product_id$': null
    }
    const { rows, count } = await Product.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ['updated_at'],
      },
      include: {
        model: AdminLinkedProduct,
        required: linked,
        order: [['created_at', 'DESC']],
        attributes: {
          exclude: ['updated_at', 'local_product_id'],
        },
        include: [{
          model: Provider,
          attributes: ['name'],
          required: true,
        }]
      },
      limit,
      offset,
      subQuery: false,
      order: [['created_at', 'DESC']],
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
};

export const getProduct = async ({ id }: { id: number }) => {
  try {
    const product = await Product.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at', 'image', 'image_type']
      },
      include: [
        {
          model: Category,
          attributes: [['id', 'value'], ['name', 'label']],
          through: {
            attributes: []
          }
        },
        {
          model: Region,
          attributes: [['id', 'value'], ['name', 'label']],
          through: {
            attributes: []
          }
        }
      ]
    });
    return product?.toJSON() as Product ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};