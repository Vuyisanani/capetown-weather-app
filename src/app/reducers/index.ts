import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';

import { environment } from 'src/environments/environment';

import * as fromWeather from 'src/app/store/reducers/weather.reducer';

export interface AppState {
  weather: fromWeather.State
}

export const reducers: ActionReducerMap<AppState> = {
    weather: fromWeather.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const selectWeather = (state: AppState) => state.weather
export const getDailyWeather = createSelector(selectWeather, (state: fromWeather.State) => {
  return state.dailyWeather;
}); 
export const getHourlyWeather = createSelector(selectWeather, fromWeather.getHourlyWeather); 
export const getCurrentWeather = createSelector(selectWeather, fromWeather.getCurrentWeather); 
export const getWeatherUnit = createSelector(selectWeather, fromWeather.getWeatherUnit);
