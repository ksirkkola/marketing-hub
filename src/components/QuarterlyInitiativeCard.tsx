import { Activity } from '@hailer/app-sdk';
import { Badge, Card, CardBody, Grid, Text } from '@chakra-ui/react';
import { QuarterlyFieldIds, QuarterlyPhaseMeta } from '../hailer/workspace-ids';

const QUARTERS = [
  { label: 'Q1', field: QuarterlyFieldIds.q1Notes },
  { label: 'Q2', field: QuarterlyFieldIds.q2Notes },
  { label: 'Q3', field: QuarterlyFieldIds.q3Notes },
  { label: 'Q4', field: QuarterlyFieldIds.q4Notes },
];

export default function QuarterlyInitiativeCard(props: { activity: Activity; onOpen: (id: string) => void }) {
  const { activity } = props;
  const goalName = activity.fields?.[QuarterlyFieldIds.goalName] as string | undefined;
  const kpiTarget = activity.fields?.[QuarterlyFieldIds.kpiTarget] as string | undefined;
  const phaseMeta = activity.currentPhase ? QuarterlyPhaseMeta[activity.currentPhase] : undefined;

  return (
    <Card
      size="sm"
      variant="outline"
      cursor="pointer"
      _hover={{ borderColor: 'blue.400', shadow: 'sm' }}
      onClick={() => props.onOpen(activity._id)}
    >
      <CardBody p={3}>
        {phaseMeta && <Badge colorScheme={phaseMeta.color} mb={2}>{phaseMeta.name}</Badge>}
        <Text fontWeight="medium" fontSize="sm" noOfLines={2}>{goalName || activity.name}</Text>
        {kpiTarget && <Text fontSize="xs" color="subtleText" mb={2} noOfLines={1}>{kpiTarget}</Text>}
        <Grid templateColumns="repeat(4, 1fr)" gap={1}>
          {QUARTERS.map(q => {
            const note = activity.fields?.[q.field] as string | undefined;
            return (
              <Card key={q.label} size="sm" variant="filled" bg="blackAlpha.100">
                <CardBody p={2}>
                  <Text fontSize="xs" fontWeight="bold" color="subtleText" mb={1}>{q.label}</Text>
                  <Text fontSize="xs" noOfLines={2}>{note || '—'}</Text>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      </CardBody>
    </Card>
  );
}
