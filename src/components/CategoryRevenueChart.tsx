import { Card, CardBody, Heading, Text } from '@chakra-ui/react';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Activity } from '@hailer/app-sdk';
import { YearlyGoalsFieldIds, YEARLY_GOALS_YEAR_FIELDS } from '../hailer/workspace-ids';

export default function CategoryRevenueChart(props: { activities: Activity[]; year: string }) {
  const yf = YEARLY_GOALS_YEAR_FIELDS[props.year];

  const revenueRows = props.activities.filter(
    a => (a.fields?.[YearlyGoalsFieldIds.metric] as string | undefined) === 'Actual Value (€)',
  );

  const data = revenueRows
    .map(a => ({
      category: (a.fields?.[YearlyGoalsFieldIds.category] as string) || '—',
      Target: (a.fields?.[yf.target] as number) ?? 0,
      Actual: (a.fields?.[yf.actual] as number) ?? 0,
    }))
    .filter(row => row.Target > 0 || row.Actual > 0);

  if (data.length === 0) {
    return null;
  }

  const formatEuro = (v: number) => `€${(v / 1000).toFixed(0)}k`;

  return (
    <Card size="sm">
      <CardBody>
        <Heading size="sm" mb={1}>Revenue by Category — {props.year}</Heading>
        <Text fontSize="xs" color="subtleText" mb={2}>
          Actual Value (€) vs. Target, by category (categories tracked in €)
        </Text>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="category" interval={0} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatEuro} width={60} />
            <Tooltip formatter={(value: unknown) => (typeof value === 'number' ? `€${value.toLocaleString('en-GB')}` : String(value ?? ''))} />
            <Legend />
            <Bar dataKey="Target" fill="#A0AEC0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="#4299E1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
