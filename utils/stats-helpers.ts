import { Order, OrderItem, Product } from "@/database/models";
import { Stats } from "@/types/product-stats";
import { Op, WhereOptions, col, fn, literal } from "sequelize";
import { isValidDate } from "./client-helpers";

export const getProductsStats = async ({ startDate, endDate, page = 1, limit = 5 }: { startDate?: string, endDate?: string, page: number, limit?: number }) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause: WhereOptions<any> | undefined = undefined;
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
        created_at: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      };
    }

    const count = await Product.count({
      include: [{
        model: OrderItem,
        required: true,
        attributes: [],
        include: [{
          model: Order,
          attributes: [],
          where: whereClause,
          required: true,
        }],
      }],
      distinct: true,
    });

    const products = await Product.findAll({
      attributes: {
        include: [
          [fn('COUNT', literal('DISTINCT `OrderItems`.`order_id`')), 'orders'],
          [fn('SUM', col('OrderItems.amount')), 'cost'],
        ],
        exclude: ['description', 'updated_at', 'created_at', 'price'],
      },
      include: [{
        model: OrderItem,
        required: true,
        attributes: [],
        include: [{
          model: Order,
          attributes: ['created_at'],
          where: whereClause,
          required: true,
        }],
      }],
      limit,
      offset,
      subQuery: false,
      group: ['Product.id'],
      having: literal('orders > 0'),
    });

    const data = {
      items: products,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };

    const serialize = JSON.stringify(data);
    const deserialize = JSON.parse(serialize) as Stats;
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  };
};