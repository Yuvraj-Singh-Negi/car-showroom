export type VehicleViewMode = 'exterior' | 'interior' | 'close-up';

export interface CarSpecification {
  engine: string;
  horsepower: string;
  acceleration: string;
  accelerationMetric: string;
  topSpeed: string;
}

export interface CarDefinition {
  id: string;
  name: string;
  modelPath: string;
  step: string;
  specification: CarSpecification;
  modelScale: number;
  initialRotation: [number, number, number];
}

export interface VehicleActions {
  openDoors: () => void;
  toggleLights: () => void;
  startEngine: () => void;
}

export interface CameraConfig {
  distance: number;
  target: [number, number, number];
  position?: [number, number, number];
}

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';
