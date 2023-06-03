import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { ProductRoute } from './routes/products.route';
import { OrderRoute } from './routes/order.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new ProductRoute(), new OrderRoute()]);

app.listen();
