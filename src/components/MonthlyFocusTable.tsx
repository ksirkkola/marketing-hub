import { Activity } from '@hailer/app-sdk';
import { Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { MONTH_ORDER, MonthlyFocusFieldIds } from '../hailer/workspace-ids';

export default function MonthlyFocusTable(props: { activities: Activity[]; onOpen: (id: string) => void }) {
  const byMonth = new Map<string, Activity>();
  for (const a of props.activities) {
    const month = a.fields?.[MonthlyFocusFieldIds.month] as string | undefined;
    if (month) byMonth.set(month, a);
  }

  if (props.activities.length === 0) {
    return <Text color="subtleText" p={4}>No monthly focus entries for this year yet.</Text>;
  }

  return (
    <TableContainer>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Month</Th>
            <Th>Top Priority 1</Th>
            <Th>Top Priority 2</Th>
            <Th>Top Priority 3</Th>
            <Th>Key Outcome</Th>
          </Tr>
        </Thead>
        <Tbody>
          {MONTH_ORDER.map(month => {
            const activity = byMonth.get(month);
            if (!activity) {
              return (
                <Tr key={month}>
                  <Td fontWeight="medium">{month}</Td>
                  <Td colSpan={4}><Text color="subtleText">—</Text></Td>
                </Tr>
              );
            }
            return (
              <Tr
                key={month}
                cursor="pointer"
                _hover={{ bg: 'blackAlpha.100' }}
                onClick={() => props.onOpen(activity._id)}
              >
                <Td fontWeight="medium">{month}</Td>
                <Td>{(activity.fields?.[MonthlyFocusFieldIds.priority1] as string) || '—'}</Td>
                <Td>{(activity.fields?.[MonthlyFocusFieldIds.priority2] as string) || '—'}</Td>
                <Td>{(activity.fields?.[MonthlyFocusFieldIds.priority3] as string) || '—'}</Td>
                <Td>{(activity.fields?.[MonthlyFocusFieldIds.keyOutcome] as string) || '—'}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
