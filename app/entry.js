import Application from './app.js';
import config from './config/environment.js';
import { installShoebox, bootRehydrated } from 'vite-ember-ssr/client';

installShoebox();
bootRehydrated(Application, config);
