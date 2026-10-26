import type { CarDefinition } from '@/types/car';

export interface CarSpecification {
  engine: string;
  horsepower: string;
  acceleration: string;
  accelerationMetric: string;
  topSpeed: string;
}

export const cars: CarDefinition[] = [
  {
    id: 'vantage',
    name: 'VANTAGE',
    modelPath: '/models/car1.glb',
    step: '01',
    specification: {
      engine: 'V8 TWIN-TURBO',
      horsepower: '503 HP',
      acceleration: '3.6s',
      accelerationMetric: '0–60 MPH',
      topSpeed: '195 MPH',
    },
    modelScale: 1,
    initialRotation: [0, Math.PI * 0.15, 0],
  },
  {
    id: 'model-two',
    name: 'MODEL TWO',
    modelPath: '/models/car2.glb',
    step: '02',
    specification: {
      engine: 'V8 TWIN-TURBO',
      horsepower: 'TBD HP',
      acceleration: 'TBD',
      accelerationMetric: '0–60 MPH',
      topSpeed: 'TBD MPH',
    },
    modelScale: 1,
    initialRotation: [0, Math.PI * 0.15, 0],
  },
  {
    id: 'model-three',
    name: 'MODEL THREE',
    modelPath: '/models/car3.glb',
    step: '03',
    specification: {
      engine: 'TBD',
      horsepower: 'TBD HP',
      acceleration: 'TBD',
      accelerationMetric: '0–60 MPH',
      topSpeed: 'TBD',
    },
    modelScale: 1,
    initialRotation: [0, Math.PI * 0.15, 0],
  },
];

export const getCarById = (id: string): CarDefinition | undefined => {
  return cars.find((car) => car.id === id);
};

export const getCarOrFallback = (id: string): CarDefinition => {
  return getCarById(id) ?? cars[0];
};

export const isValidModelId = (id: string): boolean => {
  return cars.some((car) => car.id === id);
};

export const defaultCar: CarDefinition = cars[0];
