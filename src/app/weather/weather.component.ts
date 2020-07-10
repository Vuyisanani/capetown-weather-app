import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { concatMap, map } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';

import { WeatherService } from 'src/app/api/weather.service'
import * as fromRoot from 'src/app/reducers';
import * as actions from 'src/app/store/actions/weather.action';
import { DailyWeather, Weather } from 'src/app/models/weatherfocust';

@Component({
  selector: 'weather-app',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  readonly cptLatLong = "-33.9258385,18.4232197";
  tittle = 'Cape Town Weather App';
  predictedHourdly = 'Select on the box below to diplay predicted weather in hours';
  tempForTheWeek = 'Temparature for the Week';
  tempInHours = 'Temparature for the slected day in Hours';
  noHourlyWeather = 'Theres no hourly weather predicted to be displayed at the moment';

  dailyWeather$: Observable<DailyWeather[]>;
  currentWeather$: Observable<Weather>;
  hourlyWeather$: Observable<Weather[]>;

  dayHourlyWeather: Weather[];
  hourlyWeather: Weather[];;
  stateUnit: string;
  date: string;

  MAX_C_TEMP = 25;
  MIN_C_TEMP = 15;
  MAX_F_TEMP = 77;
  MIN_F_TEMP = 59;
  CELCIUS_UNIT = 'C';
  FARENHEIT_UNIT = 'F';

  constructor(private weatherService: WeatherService, private store: Store<fromRoot.AppState>) {
    this.dailyWeather$ = this.store.select(fromRoot.getDailyWeather);
    this.currentWeather$ = this.store.select(fromRoot.getCurrentWeather);
    console.log('co-ordinates:',this.weatherService.getWeather(this.cptLatLong))

    this.store.select(fromRoot.getHourlyWeather)
      .subscribe((weather) => {
        this.hourlyWeather = weather
      });
    this.store.select(fromRoot.getWeatherUnit).subscribe(unit => {
      this.stateUnit = unit;
      console.log('stateUnit', this.stateUnit)
    });
  }

  ngOnInit() {
    this.initLoad();
    interval(1000 * 60 * 20)
      .pipe(
        concatMap(_ => this.weatherService.getWeather(this.cptLatLong)),
        map((response => this.store.dispatch(new actions.ResponseLoadedAction(response))))
    ).subscribe()
  }

  initLoad() {
    this.weatherService.getWeather(this.cptLatLong)
      .subscribe(response => this.store.dispatch(new actions.ResponseLoadedAction(response)));
  }

  changeTemperatureUnit(unit: string) {
    if (this.stateUnit !== unit)
      this.store.dispatch(new actions.ChangeTemperatureUnitAction(unit));
    this.filterDayHourlyWeather(this.date)
  }

  filterDayHourlyWeather(date: string) {
    this.date = date
    this.dayHourlyWeather = this.hourlyWeather
      .filter(weather => weather.date === this.date);
  }
}
 