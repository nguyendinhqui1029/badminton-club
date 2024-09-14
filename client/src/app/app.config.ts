import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { responseHandlerInterceptor } from '@app/interceptor/response-handler.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true,
    })),
    importProvidersFrom(
      BrowserAnimationsModule, 
      HttpClientModule),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideHttpClient(withInterceptors([responseHandlerInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
