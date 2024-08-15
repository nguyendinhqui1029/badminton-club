
import App from './app/app';
import env from './config/env';

const app = new App(env.PORT);
app.start();