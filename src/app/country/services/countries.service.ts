import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { combineLatest, map, Observable, of } from "rxjs";

import { Country, Region, SmallCountry } from "../interfaces/country.interface";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [Region.Africa, Region.America, Region.Asia, Region.Oceania, Region.Europe]

  constructor(private httpClient: HttpClient) {
  }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) return of([]);

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`

    return this.httpClient.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => (
            {
              name: country.name.common,
              cca3: country.cca3,
              borders: country.borders ?? [],
            }
          ))
        ),
      );
  }

  getCountryByAlphaCode(cca3: string): Observable<SmallCountry> {
    const url: string = `${this.baseUrl}/alpha/${cca3}?fields=cca3,name,borders`

    return this.httpClient.get<Country>(url)
      .pipe(
        map(country => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders ?? [],
          })
        ),
      );
  }

  getCountriesBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || !borders.length) return of([]);

    const countriesRequest: Observable<SmallCountry>[] = [];

    borders.forEach((code) => {
      const request = this.getCountryByAlphaCode(code);
      countriesRequest.push(request)
    })

    return combineLatest(countriesRequest);
  }
}
