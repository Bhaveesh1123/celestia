export type EquipmentStatus = 'Online' | 'Warning' | 'Offline' | 'Maintenance';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  temperature: number;
  power: number;
  lastUpdated: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
  visibility: number;
  condition: 'GOOD' | 'FAIR' | 'POOR';
  description: string;
  lastUpdated: string;
}

export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

export interface MaintenanceTask {
  id: string;
  equipment: string;
  task: string;
  scheduledDate: string;
  assignedTo: string;
  status: MaintenanceStatus;
}

export type ObservationStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Observation {
  id: string;
  target: string;
  equipment: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  status: ObservationStatus;
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
}
