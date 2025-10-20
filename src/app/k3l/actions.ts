"use server";

import { anomalyDetectionAndAlerts } from "@/ai/flows/anomaly-detection-and-alerts";
import { z } from "zod";

const formSchema = z.object({
  k3lData: z
    .string()
    .min(10, { message: "K3L data must be at least 10 characters." }),
  equipmentReports: z
    .string()
    .min(10, { message: "Equipment reports must be at least 10 characters." }),
  productionMetrics: z
    .string()
    .min(10, { message: "Production metrics must be at least 10 characters." }),
  environmentalFactors: z
    .string()
    .min(10, { message: "Environmental factors must be at least 10 characters." }),
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
      message: "Error: Please check the fields.",
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
        return { message: "Success: No anomalies detected based on the provided data." };
    }
    return { message: "Success: Anomalies detected.", issues: result };
  } catch (e) {
    return { message: "Error: Failed to process data with AI." };
  }
}
