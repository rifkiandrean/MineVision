
"use client";

import { useActionState } from "react";
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

const initialState: FormState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary">
      {pending ? "Analyzing..." : "Analyze Data"}
    </Button>
  );
}

export function AnomalyDetectionForm() {
  const [state, formAction] = useActionState(handleAnomalyDetection, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="k3lData">K3L Data</Label>
          <Textarea
            id="k3lData"
            name="k3lData"
            placeholder="e.g., Near-miss reported at Pit-B, safety officer conducting inspection..."
            rows={4}
          />
          {state.fields?.k3lData && <p className="text-sm text-destructive">{state.fields.k3lData}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipmentReports">Equipment Reports</Label>
          <Textarea
            id="equipmentReports"
            name="equipmentReports"
            placeholder="e.g., Excavator EX-05 showing high engine temperature warnings..."
            rows={4}
          />
           {state.fields?.equipmentReports && <p className="text-sm text-destructive">{state.fields.equipmentReports}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="productionMetrics">Production Metrics</Label>
          <Textarea
            id="productionMetrics"
            name="productionMetrics"
            placeholder="e.g., Hourly output from Crusher-02 dropped by 15%..."
            rows={4}
          />
           {state.fields?.productionMetrics && <p className="text-sm text-destructive">{state.fields.productionMetrics}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="environmentalFactors">Environmental Factors</Label>
          <Textarea
            id="environmentalFactors"
            name="environmentalFactors"
            placeholder="e.g., Heavy rainfall warning issued, visibility reduced..."
            rows={4}
          />
           {state.fields?.environmentalFactors && <p className="text-sm text-destructive">{state.fields.environmentalFactors}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      {state.message && (
        <Alert variant={state.message.startsWith("Error") ? "destructive" : "default"} className={!state.message.startsWith("Error") ? "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""}>
          {state.message.startsWith("Error") ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{state.message.startsWith("Error") ? "Error" : "Status"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.issues && (
        <Card className="bg-muted/50">
            <CardHeader className="flex-row items-start gap-4">
                <div className="bg-primary p-3 rounded-full">
                    <Bot className="h-6 w-6 text-primary-foreground"/>
                </div>
                <div>
                    <CardTitle>AI Analysis Complete</CardTitle>
                    <CardDescription>The following potential issues have been identified.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {state.issues.alerts.length > 0 && (
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Generated Alerts</AlertTitle>
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
                            <h4 className="font-semibold mb-2">Potential Incidents</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {state.issues.potentialIncidents.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {state.issues.equipmentFailures.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Equipment Failures</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {state.issues.equipmentFailures.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {state.issues.productionShortfalls.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Production Shortfalls</h4>
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
