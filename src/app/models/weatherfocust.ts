export class Weather {
    date: string;
    time?: string;
    summary: string;
    humidity: string;
    windSpeed: string;
    icon?: string
    temperature:number;
}

export class DailyWeather {
    date: string;
    summary: string;
    icon?: string;
    humidity: string;
    windSpeed: string;
    temperatureMin:number;
    temperatureMax:number;
}
export interface WeatherFocust {
    latitude?: number;
    longitude?: number;
    timezone: string;
    currentWeather: Weather;
    hourlyWeather: Weather[];
    dailyWeather: DailyWeather[];
  }
