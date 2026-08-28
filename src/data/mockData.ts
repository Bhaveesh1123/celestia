import type { Equipment, WeatherData, MaintenanceTask, Observation, ActivityLog } from '@/types';

export const equipmentData: Equipment[] = [
  { id: 'eq-1', name: 'Main Telescope', type: 'Telescope', status: 'Online', temperature: 18.5, power: 92, lastUpdated: '2026-08-28 10:42' },
  { id: 'eq-2', name: 'CCD Camera', type: 'Camera', status: 'Warning', temperature: 35.2, power: 78, lastUpdated: '2026-08-28 10:38' },
  { id: 'eq-3', name: 'Dome System', type: 'Mechanical', status: 'Online', temperature: 22.1, power: 95, lastUpdated: '2026-08-28 10:40' },
  { id: 'eq-4', name: 'Cooling System', type: 'Thermal', status: 'Maintenance', temperature: 15.0, power: 45, lastUpdated: '2026-08-28 09:30' },
  { id: 'eq-5', name: 'Spectrograph', type: 'Instrument', status: 'Online', temperature: 20.3, power: 88, lastUpdated: '2026-08-28 10:41' },
  { id: 'eq-6', name: 'Power System', type: 'Electrical', status: 'Offline', temperature: 0, power: 0, lastUpdated: '2026-08-28 08:15' },
];

export const weatherData: WeatherData = {
  temperature: 24,
  humidity: 68,
  cloudCover: 12,
  windSpeed: 8,
  visibility: 9.5,
  condition: 'GOOD',
  description: 'Low cloud cover and moderate wind conditions are suitable for observation.',
  lastUpdated: '2026-08-28 10:05',
};

export const maintenanceData: MaintenanceTask[] = [
  { id: 'mt-1', equipment: 'Cooling System', task: 'Refrigerant refill and pressure check', scheduledDate: '2026-08-30', assignedTo: 'Sarah Chen', status: 'Scheduled' },
  { id: 'mt-2', equipment: 'CCD Camera', task: 'Sensor calibration and cleaning', scheduledDate: '2026-08-29', assignedTo: 'Mike Rodriguez', status: 'In Progress' },
  { id: 'mt-3', equipment: 'Power System', task: 'Backup battery replacement', scheduledDate: '2026-08-25', assignedTo: 'James Park', status: 'Overdue' },
  { id: 'mt-4', equipment: 'Dome System', task: 'Motor lubrication and alignment', scheduledDate: '2026-09-02', assignedTo: 'Sarah Chen', status: 'Scheduled' },
  { id: 'mt-5', equipment: 'Main Telescope', task: 'Mirror cleaning and recoating', scheduledDate: '2026-08-20', assignedTo: 'Mike Rodriguez', status: 'Completed' },
];

export const observationData: Observation[] = [
  { id: 'obs-1', target: 'Jupiter', equipment: 'Main Telescope', date: '2026-08-29', startTime: '21:00', endTime: '23:30', priority: 'High', status: 'Planned' },
  { id: 'obs-2', target: 'Mars', equipment: 'Main Telescope', date: '2026-08-30', startTime: '20:30', endTime: '22:00', priority: 'Medium', status: 'Planned' },
  { id: 'obs-3', target: 'Andromeda Galaxy', equipment: 'Spectrograph', date: '2026-08-28', startTime: '22:00', endTime: '02:00', priority: 'High', status: 'In Progress' },
  { id: 'obs-4', target: 'Saturn', equipment: 'Main Telescope', date: '2026-08-27', startTime: '21:30', endTime: '23:00', priority: 'Medium', status: 'Completed' },
  { id: 'obs-5', target: 'Orion Nebula', equipment: 'CCD Camera', date: '2026-09-01', startTime: '23:00', endTime: '01:30', priority: 'Low', status: 'Planned' },
];

export const activityData: ActivityLog[] = [
  { id: 'act-1', time: '10:42', message: 'Main Telescope status changed to Online' },
  { id: 'act-2', time: '10:35', message: 'Maintenance task completed' },
  { id: 'act-3', time: '10:21', message: 'Observation scheduled for Jupiter' },
  { id: 'act-4', time: '10:05', message: 'Weather data refreshed' },
  { id: 'act-5', time: '09:30', message: 'Cooling System entered maintenance mode' },
  { id: 'act-6', time: '08:15', message: 'Power System went offline' },
];
