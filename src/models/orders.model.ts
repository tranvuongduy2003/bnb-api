import { Order, OrderStatus } from '@/interfaces/orders.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type OrderCreationAttributes = Optional<Order, 'id'>;
export class OrderModel extends Model<Order, OrderCreationAttributes> implements Order {
  public id: number;
  public totalPrices: number;
  public status: OrderStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof OrderModel => {
  OrderModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      totalPrices: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.CANCELLED,
          OrderStatus.DELIVERED,
          OrderStatus.RETURNED,
          OrderStatus.PAID,
          OrderStatus.UNPAID,
        ],
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return OrderModel;
};

export default initModel;