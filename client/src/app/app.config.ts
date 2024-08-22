import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { responseHandlerInterceptor } from '@app/interceptor/response-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true,
    })),
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([responseHandlerInterceptor]),
    )]
};
