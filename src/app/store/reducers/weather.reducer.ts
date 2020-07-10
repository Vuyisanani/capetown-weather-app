import { WeatherFocust, Weather, DailyWeather } from 'src/app/models/weatherfocust'
import * as actions from '../actions/weather.action';
import { format } from 'date-fns';

export interface State extends WeatherFocust {
    unit: string;
}

export const defaultState: State = {
    latitude: -33.9258385,
    longitude: 18.4232197,
    timezone: "Africa/Johannesburg",
    unit: "C",
    currentWeather: null,
    hourlyWeather: [],
    dailyWeather: [],
}

export const getCurrentWeather = (state: State): Weather => state.currentWeather;
export const getDailyWeather = (state: State): DailyWeather[] => state.dailyWeather;
export const getHourlyWeather = (state: State): Weather[] => state.hourlyWeather;
export const getWeatherUnit = (state: State) => state.unit;

export const initialState = defaultState;

export function reducer(initialState: State = defaultState, action: actions.Actions): State {
    switch (action.type) {
        case actions.RESPONSELOADED:
            return {
                ...initialState,
                dailyWeather: createDailyWeatherObject(action.payload.daily.data),
                hourlyWeather: createCurrentOrHourlyWeatherObject(action.payload.hourly.data),
                currentWeather: createCurrentWeatherObject(action.payload.currently),
            };
        case actions.CHANGE_TEMPERATURE_UNIT:
            return {
                ...initialState,
                unit: action.payload,
                dailyWeather: convertDailyTemperature(initialState.dailyWeather, action.payload),
                hourlyWeather: convertHourlyTemperature(initialState.hourlyWeather, action.payload),
                currentWeather: convertCurrentTemperature(initialState.currentWeather, action.payload)
            };
        default: return { ...initialState };

    }
}

let convertTemperature = (temperature: number, unit: string) => {
    if (unit == "C")
        return (temperature - 32) * (5 / 9);

    if (unit === "F")
        return (temperature * (9 / 5)) + 32;
}

let convertDailyTemperature = (dailyWeather: DailyWeather[], unit: string) => {
    return dailyWeather.map(weather =>
        ({
            ...weather,
            temperatureMax: convertTemperature(weather.temperatureMax, unit),
            temperatureMin: convertTemperature(weather.temperatureMin, unit),
        }));
}

let convertHourlyTemperature = (hourlyWeather: Weather[], unit: string) => {
    return hourlyWeather
    .map(weather =>
        ({
            ...weather, 
            temperature: convertTemperature(weather.temperature, unit)
        }));
}
let convertCurrentTemperature = (hourlyWeather: Weather, unit: string) => {
    return { ...hourlyWeather, 
        temperature: convertTemperature(hourlyWeather.temperature, unit) 
    }
}
let createDailyWeatherObject = (responseObject: any) => {
    if (Array.isArray(responseObject)) {
        return responseObject
        .map(weather =>
            ({
                time: getTimeFromUnixTimestamp(weather.time),
                date: getDateFromUnixTimestamp(weather.time),
                summary: weather.summary,
                humidity: weather.humidity,
                windSpeed: weather.windSpeed,
                icon: weather.icon,
                temperatureMin: convertTemperature(weather.temperatureMin, "C"),
                temperatureMax: convertTemperature(weather.temperatureMax, "C"),
            }));
    }
    else return [];
}

let createCurrentOrHourlyWeatherObject = (responseObject: any) => {
    if (Array.isArray(responseObject)) {
        return responseObject
        .map(weather =>
            ({
                time: getTimeFromUnixTimestamp(weather.time),
                date: getDateFromUnixTimestamp(weather.time),
                summary: weather.summary,
                humidity: weather.humidity,
                windSpeed: weather.windSpeed,
                icon: weather.icon,
                temperature: convertTemperature(weather.temperature, "C"),
            }));
    }
    else return [];
}

let createCurrentWeatherObject = (responseObject: any) => {
    return {
        time: getTimeFromUnixTimestamp(responseObject.time),
        date: getDateFromUnixTimestamp(responseObject.time),
        summary: responseObject.summary,
        humidity: responseObject.humidity,
        windSpeed: responseObject.windSpeed,
        icon: responseObject.icon,
        temperature: convertTemperature(responseObject.temperature, "C"),
    };
}

let getCapeTownDate = (unixTimeStamp: number) => {
    return new Date(unixTimeStamp * 1000)
}

let getTimeFromUnixTimestamp = (unixTimeStamp: number) => {
    const cptDate = getCapeTownDate(unixTimeStamp);
    return format(cptDate, "HH:00");
}

let getDateFromUnixTimestamp = (unixTimeStamp: number) => {
    const cptDate = getCapeTownDate(unixTimeStamp);
    return format(cptDate, "iii dd MMM yyyy");
}




