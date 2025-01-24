import 'module-alias/register';
import Application from "./app";
import container from './container';
container.resolve<Application>('Application')
