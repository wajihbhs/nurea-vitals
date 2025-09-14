import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { Alert, Patient } from "../types";
import { CRITICAL_STATUS, STABLE_STATUS, WATCH_STATUS } from "../types";

export const usePatientsStore = defineStore("patients", () => {
  const patients = ref<Patient[]>([]);
  const loading = ref(false);
  const alerts = ref<Alert[]>([]);

  async function fetchPatients() {
    loading.value = true;
    try {
      const res = await axios.get("/api/patients");
      setTimeout(() => {
        patients.value = res.data || [];
        loading.value = false;
        checkAlerts();
      }, 2000); // Simulate loader juste to show it
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      loading.value = false;
    }
  }

  const lastVitalRate = (vitalValue: any) => {
    return vitalValue && vitalValue.length
      ? vitalValue[vitalValue.length - 1]
      : "-";
  };
  const getPatientStatus = (p: Patient): string => {
    const { heartRate, temperature, bloodPressure } = p.vitals;
    const hr = lastVitalRate(heartRate) ?? 0;
    const temp = lastVitalRate(temperature) ?? 0;
    const bp = lastVitalRate(bloodPressure) ?? { systolic: 0, diastolic: 0 };

    const { age } = p;
    const isElderly = age >= 65;
    const isChild = age < 18;

    if (temp < 29 || temp > 42.6 || hr <= 0) {
      return CRITICAL_STATUS;
    }

    const hrRange = isElderly ? [70, 90] : isChild ? [80, 120] : [60, 80];
    if (hr < hrRange[0] || hr > hrRange[1]) {
      return WATCH_STATUS;
    }

    const bpSystolic = bp.systolic;
    const bpDiastolic = bp.diastolic;

    if (isElderly) {
      if (
        bpSystolic < 150 ||
        bpSystolic > 170 ||
        bpDiastolic < 90 ||
        bpDiastolic > 110
      ) {
        return WATCH_STATUS;
      }
    } else {
      if (
        bpSystolic < 120 ||
        bpSystolic > 140 ||
        bpDiastolic < 60 ||
        bpDiastolic > 80
      ) {
        return WATCH_STATUS;
      }
    }

    return STABLE_STATUS;
  };

  const checkAlerts = () => {
    alerts.value = [];
    for (const p of patients.value) {
      const st = getPatientStatus(p);
      const hr = lastVitalRate(p.vitals.heartRate);
      const temp = lastVitalRate(p.vitals.temperature);
      const bp = lastVitalRate(p.vitals.bloodPressure);

      if (st === CRITICAL_STATUS) {
        alerts.value.push({
          patient: p,
          type: "global",
          level: CRITICAL_STATUS,
        });
      }

      const { age } = p;
      const isElderly = age >= 65;
      const isChild = age < 18;
      const hrRange = isElderly ? [70, 90] : isChild ? [80, 120] : [60, 80];
      const bpRange = isElderly
        ? { systolic: [150, 170], diastolic: [90, 110] }
        : { systolic: [120, 140], diastolic: [60, 80] };

      if (temp && (temp < 36.3 || temp > 37.5)) {
        alerts.value.push({
          patient: p,
          type: "temperature",
          value: temp,
          level: WATCH_STATUS,
        });
      }

      if (hr && (hr < hrRange[0] || hr > hrRange[1])) {
        alerts.value.push({
          patient: p,
          type: "heartRate",
          value: hr,
          level: WATCH_STATUS,
        });
      }

      if (
        bp &&
        (bp.systolic < bpRange.systolic[0] ||
          bp.systolic > bpRange.systolic[1] ||
          bp.diastolic < bpRange.diastolic[0] ||
          bp.diastolic > bpRange.diastolic[1])
      ) {
        alerts.value.push({
          patient: p,
          type: "bloodPressure",
          value: `${bp.systolic}/${bp.diastolic}`,
          level: WATCH_STATUS,
        });
      }
    }
  };

  return {
    patients,
    loading,
    fetchPatients,
    getPatientStatus,
    lastVitalRate,
    alerts,
  };
});
