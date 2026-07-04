import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Company, Lead } from '../../types';

interface ExportButtonsProps {
  data: (Company | Lead)[];
  filename?: string;
}

export function ExportButtons({ data, filename = 'leads' }: ExportButtonsProps) {
  const prepareData = () => {
    return data.map((item) => {
      const d: any = {
        Name: item.name,
        Telefon: item.phone || '',
        Adresse: item.address,
        Website: item.website || '',
        Email: item.email || '',
        Kategorie: item.category || '',
        Bewertung: item.rating || '',
        Bewertungen: item.reviewCount || '',
      };
      if ('callStatus' in item) {
        d['Status'] = item.callStatus;
        d['Notizen'] = item.notes || '';
        d['Tags'] = item.tags?.join(', ') || '';
        d['Favorit'] = item.isFavorite ? 'Ja' : 'Nein';
      }
      return d;
    });
  };

  const exportCSV = () => {
    const rows = prepareData();
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const rows = prepareData();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  if (data.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={exportCSV}
        className="px-3 py-1 border rounded text-sm bg-card hover:bg-muted font-medium"
      >
        CSV Export
      </button>
      <button
        onClick={exportExcel}
        className="px-3 py-1 border rounded text-sm bg-card hover:bg-muted font-medium"
      >
        Excel Export
      </button>
    </div>
  );
}
