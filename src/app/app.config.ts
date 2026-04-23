import { registerLocaleData } from '@angular/common'
import { provideHttpClient, withFetch } from '@angular/common/http'
import en from '@angular/common/locales/en'
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n'

import { routes } from './app.routes'

registerLocaleData(en)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNzI18n(en_US)
  ]
}
