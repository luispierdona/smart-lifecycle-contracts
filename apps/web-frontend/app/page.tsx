"use client";
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [weight, setWeight] = useState('');
  const [materialId, setMaterialId] = useState('');

  const loadData = async () => {
    try {
      const [mats, regs] = await Promise.all([
        apiService.getMaterials(),
        apiService.getRegistrations()
      ]);
      setMaterials(mats);
      setRegistrations(regs);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const weightNum = Number(weight);
  const isWeightValid = weight.trim() !== '' && !Number.isNaN(weightNum) && weightNum > 0;
  const isMaterialValid = materialId !== '';
  const isFormValid = isMaterialValid && isWeightValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createRegistration({
        material_id: Number(materialId),
        weight: Number(weight)
      });

      if (response.status === 'CONTRACTED') {
          toast.success("Registration Successful", {
            description: `A contract (${response.contract.contract_number}) has been generated automatically.`
          });
      } else {
          toast.info("Registration Successful", {
            description: "The waste has been processed."
          });
      }

      setWeight('');
      setMaterialId('');
      loadData();
    } catch (err) {
      toast.error("Error", {
        description: "Could not save the registration. Please check the backend."
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Environmental Dashboard</h1>
        <p className="text-muted-foreground">Track waste recycling and CO2 impact in real-time.</p>
      </header>

      {/* form */}
      <Card className="w-full overflow-hidden border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-background shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            Register Entry
          </CardTitle>
          <CardDescription className="text-base">Add new recycled materials to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Material</label>
                <Select onValueChange={setMaterialId} value={materialId} required>
                  <SelectTrigger className="bg-background/80 w-full" aria-required="true">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m: any) => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  min={0.01}
                  step="any"
                  placeholder="e.g. 25"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-11 bg-background/80"
                  required
                />
              </div>
              <Button type="submit" disabled={!isFormValid} className="h-11 bg-emerald-700 hover:bg-emerald-800 px-8 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* table */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest waste registrations and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>CO2 Reduction</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg: any) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.material?.name}</TableCell>
                    <TableCell>{reg.weight} kg</TableCell>
                    <TableCell className="text-green-600">-{reg.calculated_co2} kg</TableCell>
                    <TableCell>
                      <Badge variant={reg.status === 'CONTRACTED' ? 'default' : 'secondary'}>
                        {reg.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}