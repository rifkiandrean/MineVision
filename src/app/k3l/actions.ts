
"use server";

import { anomalyDetectionAndAlerts } from "@/ai/flows/anomaly-detection-and-alerts";
import { z } from "zod";

const formSchema = z.object({
  k3lData: z
    .string()
    .min(10, { message: "Data K3L harus memiliki minimal 10 karakter." }),
  equipmentReports: z
    .string()
    .min(10, { message: "Laporan peralatan harus memiliki minimal 10 karakter." }),
  productionMetrics: z
    .string()
    .min(10, { message: "Metrik produksi harus memiliki minimal 10 karakter." }),
  environmentalFactors: z
    .string()
    .min(10, { message: "Faktor lingkungan harus memiliki minimal 10 karakter." }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: {
    potentialIncidents: string[];
    equipmentFailures: string[];
    productionShortfalls: string[];
    alerts: string[];
  };
};

export async function handleAnomalyDetection(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    k3lData: formData.get("k3lData"),
    equipmentReports: formData.get("equipmentReports"),
    productionMetrics: formData.get("productionMetrics"),
    environmentalFactors: formData.get("environmentalFactors"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: "Error: Harap periksa kembali isian Anda.",
      fields: {
        k3lData: fieldErrors.k3lData?.[0],
        equipmentReports: fieldErrors.equipmentReports?.[0],
        productionMetrics: fieldErrors.productionMetrics?.[0],
        environmentalFactors: fieldErrors.environmentalFactors?.[0],
      },
    };
  }

  try {
    const result = await anomalyDetectionAndAlerts(validatedFields.data);
    if (!result || (result.alerts.length === 0 && result.potentialIncidents.length === 0 && result.equipmentFailures.length === 0 && result.productionShortfalls.length === 0)) {
        return { message: "Sukses: Tidak ada anomali yang terdeteksi berdasarkan data yang diberikan." };
    }
    return { message: "Sukses: Anomali terdeteksi.", issues: result };
  } catch (e) {
    return { message: "Error: Gagal memproses data dengan AI." };
  }
}
