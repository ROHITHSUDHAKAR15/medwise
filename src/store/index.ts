import { create } from 'zustand';
import type { 
  User, 
  ChatMessage, 
  MoodEntry, 
  Medication, 
  Appointment, 
  HealthRecord,
  HealthMetric,
  Symptom,
  Doctor,
  HealthInsight
} from '../types';

interface AppState {
  user: User | null;
  chatMessages: ChatMessage[];
  moodEntries: MoodEntry[];
  medications: Medication[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  healthMetrics: HealthMetric[];
  symptoms: Symptom[];
  doctors: Doctor[];
  healthInsights: HealthInsight[];
  isDarkMode: boolean;
  setUser: (user: User | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addMedication: (medication: Medication) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  addHealthRecord: (record: HealthRecord) => void;
  addHealthMetric: (metric: HealthMetric) => void;
  addSymptom: (symptom: Symptom) => void;
  addDoctor: (doctor: Doctor) => void;
  addHealthInsight: (insight: HealthInsight) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  chatMessages: [],
  moodEntries: [],
  medications: [],
  appointments: [],
  healthRecords: [],
  healthMetrics: [],
  symptoms: [],
  doctors: [],
  healthInsights: [],
  isDarkMode: true, // Set default to true
  setUser: (user) => set({ user }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  addMoodEntry: (entry) =>
    set((state) => ({ moodEntries: [...state.moodEntries, entry] })),
  addMedication: (medication) =>
    set((state) => ({ medications: [...state.medications, medication] })),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (id, appointment) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...appointment } : apt
      ),
    })),
  addHealthRecord: (record) =>
    set((state) => ({ healthRecords: [...state.healthRecords, record] })),
  addHealthMetric: (metric) =>
    set((state) => ({ healthMetrics: [...state.healthMetrics, metric] })),
  addSymptom: (symptom) =>
    set((state) => ({ symptoms: [...state.symptoms, symptom] })),
  addDoctor: (doctor) =>
    set((state) => ({ doctors: [...state.doctors, doctor] })),
  addHealthInsight: (insight) =>
    set((state) => ({ healthInsights: [...state.healthInsights, insight] })),
  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),
}));