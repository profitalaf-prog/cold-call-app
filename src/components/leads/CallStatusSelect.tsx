import { CallStatus } from '../../types';

interface CallStatusSelectProps {
  value: CallStatus;
  onChange: (status: CallStatus) => void;
  className?: string;
}

const statusOptions: { value: CallStatus; label: string; symbol: string; colorClass: string }[] = [
  { value: 'not_called', label: 'Nicht angerufen', symbol: '□', colorClass: 'text-gray-500' },
  { value: 'callback', label: 'Rückruf', symbol: '🟡', colorClass: 'text-yellow-600' },
  { value: 'success', label: 'Erfolgreich', symbol: '🟢', colorClass: 'text-green-600' },
  { value: 'not_interested', label: 'Kein Interesse', symbol: '🔴', colorClass: 'text-red-600' },
  { value: 'invalid_number', label: 'Ungültige Nummer', symbol: '⚫', colorClass: 'text-gray-900' },
];

export function CallStatusSelect({ value, onChange, className = '' }: CallStatusSelectProps) {
  return (
    <select
      className={`border rounded px-2 py-1 text-sm bg-background text-foreground ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value as CallStatus)}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.symbol} {opt.label}
        </option>
      ))}
    </select>
  );
}
