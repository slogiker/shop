import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { routes } from './app.routes';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { withCredentials: true } };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(config))
  ]
};
