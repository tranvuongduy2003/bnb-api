import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { CreateOrderDto } from '@/dtos/orders.dto';
import { Order } from '@interfaces/orders.interface';
import { OrderService } from '@/services/orders.service';
import { RequestWithUser, Role } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/httpException';

export class OrderController {
  public order = Container.get(OrderService);

  public getOrders = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      let findAllOrdersData: Order[];
      const acceptedRoles = [Role.ADMIN, Role.DELIVERER];

      if (acceptedRoles.includes(user.getDataValue('role'))) {
        findAllOrdersData = await this.order.findAllOrders();
      } else {
        findAllOrdersData = await this.order.findAllOrdersByUserId(user.id);
      }

      res.status(200).json({ data: findAllOrdersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.id);

      if (req.user.role === Role.CUSTOMER && !this.order.isOrderBelongsToUser(orderId, req.user.id)) {
        throw new HttpException(404, "Order doesn't exist");
      }

      const findOneOrderData: Order = await this.order.findOrderById(orderId);

      res.status(200).json({ data: findOneOrderData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const orderData: CreateOrderDto = req.body;
      const createOrderData: Order = await this.order.createOrder(orderData, req.user.getDataValue('id'));

      res.status(201).json({ data: createOrderData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.id);
      const orderData: CreateOrderDto = req.body;
      const updateOrderData: Order = await this.order.updateOrder(orderId, orderData);

      if (req.user.role === Role.CUSTOMER && !this.order.isOrderBelongsToUser(orderId, req.user.id)) {
        throw new HttpException(404, "Order doesn't exist");
      }

      res.status(200).json({ data: updateOrderData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.id);

      if (req.user.role === Role.CUSTOMER && !this.order.isOrderBelongsToUser(orderId, req.user.id)) {
        throw new HttpException(404, "Order doesn't exist");
      }

      const deleteOrderData: Order = await this.order.deleteOrder(orderId);

      res.status(200).json({ data: deleteOrderData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
