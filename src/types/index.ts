import { StaticImageData } from 'next/image';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  weight?: number;
  height?: number;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory?: {
    conditions: string[];
    surgeries: string[];
    medications: string[];
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  availability: {
    date: string;
    slots: string[];
  }[];
  location: string;
  image: string;
}

export interface HealthMetric {
  id: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'temperature' | 'oxygen' | 'bmi' | 'sleep';
  value: number | string;
  unit: string;
  timestamp: Date;
  notes?: string;
  category?: 'good' | 'warning' | 'critical';
}

export interface HealthInsight {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  date: Date;
}

export interface Prescription {
  id: string;
  image: string;
  parsedData: {
    medicines: Array<{
      name: string;
      dosage: string;
      timing: string;
    }>;
    suggestions?: string[];
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
  description?: string;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'stressed';
  note: string;
  timestamp: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: Date;
  endDate?: Date;
  notes?: string;
  refillReminder?: boolean;
  remainingDoses: number;
  duration: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'checkup' | 'followup' | 'specialist' | 'emergency';
}

export interface HealthRecord {
  id: string;
  date: Date;
  type: 'vaccination' | 'test' | 'procedure' | 'diagnosis';
  title: string;
  description: string;
  provider: string;
  attachments?: string[];
  results?: string;
}