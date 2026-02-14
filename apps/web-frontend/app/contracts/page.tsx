"use client";
import { useEffect, useState, useRef } from 'react';
import { apiService } from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractViewer, type ContractRegistration } from "./contractViewer";

export default function ContractsPage() {
  const [registrations, setRegistrations] = useState<ContractRegistration[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState<ContractRegistration | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    apiService.getRegistrations().then((data: ContractRegistration[]) => {
      const withContracts = data.filter((r) => r.contract !== null);
      setRegistrations(withContracts);
    });
  }, []);

  const openViewer = (reg: ContractRegistration) => {
    setSelected(reg);
    setViewerOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Recycling Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => openViewer(reg)}
                      className="font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                    >
                      {reg.contract?.contract_number}
                    </button>
                  </TableCell>
                  <TableCell>{reg.material?.name}</TableCell>
                  <TableCell>{reg.weight} kg</TableCell>
                  <TableCell>{reg.contract?.expiry_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ContractViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        registration={selected}
      />
    </div>
  );
}