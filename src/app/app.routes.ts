import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'selector', loadChildren: () => import('./country/country.module').then(m => m.CountryModule) },
  { path: '**', redirectTo: 'selector' }
];
