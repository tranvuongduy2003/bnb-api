import { Router } from 'express';
import { OrderItemController } from '@/controllers/orderItem.controller';
import { CreateOrderItemDto } from '@/dtos/orderItem.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminCheckMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';

export class OrderItemRoute implements Routes {
  public path = '/ordersitem';
  public router = Router();
  public orderItem = new OrderItemController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.orderItem.getOrdersItem);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware, this.orderItem.getOrderItemById);
    this.router.post(`${this.path}`, AuthMiddleware, AdminCheckMiddleware, ValidationMiddleware(CreateOrderItemDto), this.orderItem.createOrderItem);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware,
      AdminCheckMiddleware,
      ValidationMiddleware(CreateOrderItemDto, true),
      this.orderItem.updateOrderItem,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware, AdminCheckMiddleware, this.orderItem.deleteOrderItem);
  }
}