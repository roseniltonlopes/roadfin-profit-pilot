// Lightweight client-side store for the RoadFin MVP.
// Persists vehicle, goal, and work logs in localStorage.

import { useEffect, useState } from "react";

export type Vehicle = {
  name: string;
  ownership: "own" | "financed" | "rented";
  profile: "economic" | "sedan" | "suv";
  plate: string;
  dailyExpenses: number;
  annualIpva: number;
  annualInsurance: number;
  monthlyPayment: number;
  maintenancePerKm: number;
  depreciationPerKm: number;
  fuelConsumption: number; // km/L
  fuelPrice: number;
};

export type Goal = {
  monthlyProfitGoal: number;
  workDaysPerMonth: number;
  hoursPerDay: number;
  kmPerDay: number;
};

export type WorkLog = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  kmDriven: number;
  uberRevenue: number;
  app99Revenue: number;
  otherRevenue: number;
  grossRevenue: number;
  fuelCost: number;
  maintenanceCost: number;
  depreciationCost: number;
  fixedDailyCost: number;
  netProfit: number;
  profitMargin: number;
  profitPerHour: number;
  profitPerKm: number;
};

export type User = {
  email: string;
  name: string;
  lastName: string;
  trialStartedAt: string;
};

const KEYS = {
  user: "roadfin.user",
  vehicle: "roadfin.vehicle",
  goal: "roadfin.goal",
  logs: "roadfin.logs",
  theme: "roadfin.theme",
} as const;

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T | null) {
  if (typeof window === "undefined") return;
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("roadfin:update", { detail: key }));
}

export function usePersisted<T>(key: string, fallback: T): [T, (v: T | null) => void] {
  const [value, setValue] = useState<T>(() => read<T>(key) ?? fallback);
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (ce.detail === key) setValue(read<T>(key) ?? fallback);
    };
    window.addEventListener("roadfin:update", handler);
    return () => window.removeEventListener("roadfin:update", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [
    value,
    (v) => {
      write(key, v);
      setValue((v ?? fallback) as T);
    },
  ];
}

export const store = {
  getUser: () => read<User>(KEYS.user),
  setUser: (u: User | null) => write(KEYS.user, u),
  getVehicle: () => read<Vehicle>(KEYS.vehicle),
  setVehicle: (v: Vehicle | null) => write(KEYS.vehicle, v),
  getGoal: () => read<Goal>(KEYS.goal),
  setGoal: (g: Goal | null) => write(KEYS.goal, g),
  getLogs: (): WorkLog[] => read<WorkLog[]>(KEYS.logs) ?? [],
  addLog: (log: WorkLog) => {
    const logs = store.getLogs();
    write(KEYS.logs, [log, ...logs]);
  },
  removeLog: (id: string) => {
    write(
      KEYS.logs,
      store.getLogs().filter((l) => l.id !== id),
    );
  },
};

export const KEYS_EXPORT = KEYS;

// --- Calculations ---

export function computeLog(input: {
  uber: number;
  app99: number;
  other: number;
  hours: number;
  km: number;
  fuelConsumption: number;
  fuelPrice: number;
  vehicle: Vehicle;
  goal?: Goal | null;
}): Omit<WorkLog, "id" | "date" | "startTime" | "endTime"> {
  const grossRevenue = input.uber + input.app99 + input.other;
  const fuelCost =
    input.fuelConsumption > 0 ? (input.km / input.fuelConsumption) * input.fuelPrice : 0;
  const maintenanceCost = input.km * input.vehicle.maintenancePerKm;
  const depreciationCost = input.km * input.vehicle.depreciationPerKm;
  const workDays = input.goal?.workDaysPerMonth || 22;
  const fixedDailyCost =
    (input.vehicle.annualIpva / 12 +
      input.vehicle.annualInsurance / 12 +
      input.vehicle.monthlyPayment) /
    workDays;
  const dailyExpenses = input.vehicle.dailyExpenses;
  const netProfit =
    grossRevenue - fuelCost - maintenanceCost - depreciationCost - fixedDailyCost - dailyExpenses;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const profitPerHour = input.hours > 0 ? netProfit / input.hours : 0;
  const profitPerKm = input.km > 0 ? netProfit / input.km : 0;
  return {
    hoursWorked: input.hours,
    kmDriven: input.km,
    uberRevenue: input.uber,
    app99Revenue: input.app99,
    otherRevenue: input.other,
    grossRevenue,
    fuelCost,
    maintenanceCost,
    depreciationCost,
    fixedDailyCost: fixedDailyCost + dailyExpenses,
    netProfit,
    profitMargin,
    profitPerHour,
    profitPerKm,
  };
}

export const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
