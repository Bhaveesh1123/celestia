import { weatherData } from '@/data/mockData';
import type { WeatherData } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const jitter = (base: number, range: number) => +(base + (Math.random() - 0.5) * range).toFixed(1);

export const weatherService = {
  async getCurrent(): Promise<WeatherData> {
    await delay(500);
    return { ...weatherData };
  },

  async refresh(): Promise<WeatherData> {
    await delay(700);
    const cloud = Math.round(jitter(weatherData.cloudCover, 10));
    const wind = Math.round(jitter(weatherData.windSpeed, 4));
    const visibility = +Math.max(1, jitter(weatherData.visibility, 2)).toFixed(1);
    const condition: WeatherData['condition'] = cloud < 25 && wind < 15 ? 'GOOD' : cloud < 50 ? 'FAIR' : 'POOR';
    return {
      temperature: Math.round(jitter(weatherData.temperature, 3)),
      humidity: Math.round(jitter(weatherData.humidity, 10)),
      cloudCover: Math.max(0, cloud),
      windSpeed: Math.max(0, wind),
      visibility,
      condition,
      description:
        condition === 'GOOD'
          ? 'Low cloud cover and moderate wind conditions are suitable for observation.'
          : condition === 'FAIR'
            ? 'Conditions are marginal. Observation possible but quality may be reduced.'
            : 'High cloud cover or strong winds make observation unsuitable at this time.',
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
  },
};
