import { Card, CardBody, Heading, Text } from '@chakra-ui/react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Activity } from '@hailer/app-sdk';
import { YEARS, YearlyGoalsFieldIds, YEARLY_GOALS_YEAR_FIELDS } from '../hailer/workspace-ids';

export default function RevenueTrajectoryChart(props: { activities: Activity[] }) {
  const revenueActivity = props.activities.find(
    a => (a.fields?.[YearlyGoalsFieldIds.metric] as string | undefined) === 'Annual Revenue (€)',
  );

  if (!revenueActivity) {
    return null;
  }

  const data = YEARS.map(year => {
    const yf = YEARLY_GOALS_YEAR_FIELDS[year];
    return {
      year,
      Target: (revenueActivity.fields?.[yf.target] as number) ?? null,
      Actual: (revenueActivity.fields?.[yf.actual] as number) ?? null,
    };
  });

  const formatEuro = (v: number) => `€${(v / 1000).toFixed(0)}k`;

  return (
    <Card size="sm">
      <CardBody>
        <Heading size="sm" mb={1}>5-Year Revenue Trajectory</Heading>
        <Text fontSize="xs" color="subtleText" mb={2}>Annual Revenue (€) — Target vs. Actual, 2026–2030</Text>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" interval={0} />
            <YAxis tickFormatter={formatEuro} width={60} />
            <Tooltip formatter={(value: unknown) => (typeof value === 'number' ? `€${value.toLocaleString('en-GB')}` : String(value ?? ''))} />
            <Legend />
            <Line type="monotone" dataKey="Target" stroke="#A0AEC0" strokeDasharray="6 4" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Actual" stroke="#48BB78" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
