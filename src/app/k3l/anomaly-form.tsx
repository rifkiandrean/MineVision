
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { handleAnomalyDetection, FormState } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, AlertTriangle, CheckCircle, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const initialState: FormState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary">
      {pending ? "Menganalisis..." : "Analisis Data"}
    </Button>
  );
}

export function AnomalyDetectionForm() {
  const [state, formAction] = useActionState(handleAnomalyDetection, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.message) return;

    if (state.message.startsWith("Error")) {
       toast({
         variant: "destructive",
         title: "Analisis Gagal",
         description: state.message,
       });
    } else if (state.message.startsWith("Sukses") && !state.issues) {
        toast({
         title: "Analisis Selesai",
         description: state.message,
       });
    }

  }, [state, toast]);


  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="k3lData">Data K3L</Label>
          <Textarea
            id="k3lData"
            name="k3lData"
            placeholder="cth., Laporan nyaris celaka di Pit-B, petugas keselamatan sedang melakukan inspeksi..."
            rows={4}
          />
          {state.fields?.k3lData && <p className="text-sm text-destructive">{state.fields.k3lData}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipmentReports">Laporan Peralatan</Label>
          <Textarea
            id="equipmentReports"
            name="equipmentReports"
            placeholder="cth., Excavator EX-05 menunjukkan peringatan suhu mesin tinggi..."
            rows={4}
          />
           {state.fields?.equipmentReports && <p className="text-sm text-destructive">{state.fields.equipmentReports}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="productionMetrics">Metrik Produksi</Label>
          <Textarea
            id="productionMetrics"
            name="productionMetrics"
            placeholder="cth., Output per jam dari Crusher-02 turun 15%..."
            rows={4}
          />
           {state.fields?.productionMetrics && <p className="text-sm text-destructive">{state.fields.productionMetrics}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="environmentalFactors">Faktor Lingkungan</Label>
          <Textarea
            id="environmentalFactors"
            name="environmentalFactors"
            placeholder="cth., Peringatan hujan lebat dikeluarkan, jarak pandang berkurang..."
            rows={4}
          />
           {state.fields?.environmentalFactors && <p className="text-sm text-destructive">{state.fields.environmentalFactors}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
      
      {state.issues && (
        <Card className="bg-muted/50">
            <CardHeader className="flex-row items-start gap-4">
                <div className="bg-primary p-3 rounded-full">
                    <Bot className="h-6 w-6 text-primary-foreground"/>
                </div>
                <div>
                    <CardTitle>Analisis AI Selesai</CardTitle>
                    <CardDescription>Potensi masalah berikut telah diidentifikasi.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {state.issues.alerts.length > 0 && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Peringatan Dibuat</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {state.issues.alerts.map((alert, i) => <li key={i}>{alert}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {state.issues.potentialIncidents.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Potensi Insiden</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {state.issues.potentialIncidents.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {state.issues.equipmentFailures.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Kerusakan Peralatan</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {state.issues.equipmentFailures.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {state.issues.productionShortfalls.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Penurunan Produksi</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {state.issues.productionShortfalls.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      )}
    </form>
  );
}
