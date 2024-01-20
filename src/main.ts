import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';


bootstrapApplication(AppComponent,  {
  providers: [provideHttpClient(), provideProtractorTestingSupport(), provideRouter(routes), provideAnimations()]
}).catch((err) => console.error(err));

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
