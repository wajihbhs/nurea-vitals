import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { Patient } from "../types";

export const usePatientsStore = defineStore("patients", () => {
  const patients = ref<Patient[]>([]);
  const loading = ref(false);

  async function fetchPatients() {
    loading.value = true;
    try {
      const res = await axios.get("/api/patients");
      setTimeout(() => {
        patients.value = res.data || [];
        loading.value = false;
      }, 2000); // Simulate loader juste to show it
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      loading.value = false;
    }
  }

  return {
    patients,
    loading,
    fetchPatients,
  };
});
