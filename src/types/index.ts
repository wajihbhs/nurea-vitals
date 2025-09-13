export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface Vitals {
  heartRate: number[];
  temperature: number[];
  bloodPressure: BloodPressure[];
  oxygenSaturation: number[];
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  medicalRecordNumber: string;
  vitals: Vitals;
}
