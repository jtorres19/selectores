import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { filter, of, switchMap, tap } from "rxjs";

import { CountriesService } from "../../services/countries.service";
import { Region, SmallCountry } from "../../interfaces/country.interface";
import { JsonPipe, NgForOf } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgForOf,
  ],
  providers: [CountriesService]
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.formBuilder.group({
    region: [{ value: '', disabled: false }, [Validators.required]],
    country: [{ value: '', disabled: true }, [Validators.required]],
    border: [{ value: '', disabled: true }, [Validators.required]],
  });
  public countriesByRegion: SmallCountry[] = [];
  public bordersByCountry: SmallCountry[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) {
  }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions
  }

  private onRegionChanged(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
        tap((region) => region
          ? this.myForm.get('country')?.enable()
          : this.myForm.get('country')?.disable()),
        switchMap((region) => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe(countries => this.countriesByRegion = countries);
  }

  private onCountryChanged(): void {
    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')?.setValue('')),
        tap((cca3) => cca3
          ? this.myForm.get('border')?.enable()
          : this.myForm.get('border')?.disable()
        ),
        filter((cca3) => cca3.length),
        /*--- With original countries array ---*/
        switchMap((cca3) => this.countriesByRegion.filter((country) => country.cca3 === cca3)),
        switchMap((countrySelected) => {
            const countriesBorder: SmallCountry[] = []

            countrySelected.borders.forEach((code) =>
              this.countriesByRegion.filter((country) => country.cca3 === code && countriesBorder.push(country))
            );

            return of(countriesBorder);
          }
        ),
        /*--- With API call ---*/
        // switchMap((cca3) => this.countriesService.getCountryByAlphaCode(cca3)),
        // switchMap((country) => this.countriesService.getCountriesBordersByCodes(country.borders)),
      )
      .subscribe(countries => this.bordersByCountry = countries);
  }
}
