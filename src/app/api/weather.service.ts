import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, pipe, zip, range, timer } from 'rxjs';
import { catchError, tap, retryWhen, map, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apikey: string;
  private readonly url: string;

  constructor(private httpClient: HttpClient) {
    
    this.apikey = "591ef5bd5f9e07c7547639a93f6feb33";
    this.url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
  }
    
  getWeather(cptCoordinates: string): Observable < any > {
    return this.httpClient.get <any> (`${this.url}${this.apikey}/${cptCoordinates}`)
      .pipe(
        // Passing backoff MaxTries: 4, and millisecond: 100
        this.backoff(4, 100),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  backoff(maxTries, ms) {
    return pipe(
      //(2, 4, 8, 16)
      retryWhen(attempts => zip(range(2, maxTries), attempts)
        .pipe(
          map(([i]) => i * i),
          mergeMap(i => timer(i * ms))
        )
      )
    );
  }
}
