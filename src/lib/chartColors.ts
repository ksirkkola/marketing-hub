// Maps our Chakra colorScheme names to representative hex values for Recharts
// (Recharts needs literal color strings, not Chakra tokens).
const ACCENT_HEX: Record<string, string> = {
  gray: '#A0AEC0',
  red: '#F56565',
  orange: '#ED8936',
  yellow: '#ECC94B',
  green: '#48BB78',
  teal: '#38B2AC',
  blue: '#4299E1',
  cyan: '#0BC5EA',
  purple: '#9F7AEA',
  pink: '#ED64A6',
};

export function accentHex(colorScheme: string): string {
  return ACCENT_HEX[colorScheme] ?? ACCENT_HEX.gray;
}
