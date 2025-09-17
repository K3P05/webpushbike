import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/component/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/component/ui/Table";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Buttons";

type Peserta = {
  id_pendaftaran: number;
  nama: string;
  plat_number: string;
};

type InputHasilLombaProps = {
  pesertaList: Peserta[];
  onSubmit: (data: unknown) => void;
  onCancel: () => void;
};

export default function InputHasilLomba({
  pesertaList,
  onSubmit,
  onCancel,
}: InputHasilLombaProps) {
  const [formData, setFormData] = useState(
    pesertaList.map((p) => ({
      id_pendaftaran: p.id_pendaftaran,
      nama: p.nama,
      plat_number: p.plat_number,
      finish: "",
      penalty: "",
    }))
  );

  const handleChange = (
    index: number,
    field: "finish" | "penalty",
    value: string
  ) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <h2 className="text-xl font-semibold">Input Hasil Lomba</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Plat</TableHead>
                <TableHead>Finish</TableHead>
                <TableHead>Penalty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.map((p, i) => (
                <TableRow key={p.id_pendaftaran}>
                  <TableCell>{p.nama}</TableCell>
                  <TableCell>{p.plat_number}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      size="md"
                      placeholder="Waktu finish"
                      value={p.finish}
                      onChange={(e) =>
                        handleChange(i, "finish", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      size="md"
                      placeholder="Penalty"
                      value={p.penalty}
                      onChange={(e) =>
                        handleChange(i, "penalty", e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onCancel}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
