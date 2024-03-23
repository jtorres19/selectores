import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from "./country-routing.module";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CountryRoutingModule,
    HttpClientModule,
  ]
})
export class CountryModule { }
