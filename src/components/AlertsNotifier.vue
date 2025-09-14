<script setup lang="ts">
import { watch } from "vue";
import { usePatientsStore } from "../stores/patients";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

const store = usePatientsStore();
const { t } = useI18n();
const toast = useToast();

watch(
    () => store.alerts.slice(),
    (alerts) => {
      if (!alerts.length) return;

      alerts.forEach(alert => {
        const { patient, type, value } = alert;
        const name = `${patient.firstName} ${patient.lastName}`;

        let message = "";
        let options: any = { type: "info" };

        switch(type) {
          case "global":
            message = t("alerts.messages.global", { name });
            options.type = "error";
            options.timeout = 15000;
            break;
          case "temperature":
            message = t("alerts.messages.temperature", { name, value });
            options.type = "warning";
            options.timeout = 5000;
            break;
          case "heartRate":
            message = t("alerts.messages.heart-rate", { name, value });
            options.type = "warning";
            options.timeout = 5000;
            break;
          case "bloodPressure":
            const bp = patient.vitals.bloodPressure.slice(-1)[0];
            message = t("alerts.messages.blood-pressure", { name, systolic: bp.systolic, diastolic: bp.diastolic });
            options.type = "warning";
            options.timeout = 5000;
            break;
          default:
            message = t("alerts.messages.default", { name });
            options.type = "info";
            options.timeout = 5000;
        }

        toast(message, options);
      });

      setTimeout(() => {
        store.alerts.splice(0, store.alerts.length);
      });
    },
    { deep: true }
);
</script>
