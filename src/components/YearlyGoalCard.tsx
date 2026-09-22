import { Activity } from '@hailer/app-sdk';
import { Badge, Card, CardBody, HStack, Text } from '@chakra-ui/react';
import { YEARLY_GOALS_CATEGORIES, YearlyGoalsFieldIds, YEARLY_GOALS_YEAR_FIELDS } from '../hailer/workspace-ids';

function fmt(value: unknown): string {
  return typeof value === 'number' ? value.toLocaleString('en-GB') : '—';
}

function progressColor(actual: unknown, target: unknown): string {
  if (typeof actual !== 'number' || typeof target !== 'number' || target === 0) return 'gray.400';
  const ratio = actual / target;
  if (ratio >= 1) return 'green.500';
  if (ratio >= 0.7) return 'orange.400';
  return 'red.400';
}

export default function YearlyGoalCard(props: { activity: Activity; year: string; onOpen: (id: string) => void }) {
  const { activity, year } = props;
  const metric = activity.fields?.[YearlyGoalsFieldIds.metric] as string | undefined;
  const category = activity.fields?.[YearlyGoalsFieldIds.category] as string | undefined;
  const categoryColor = YEARLY_GOALS_CATEGORIES.find(c => c.id === category)?.color ?? 'gray';

  const yearFields = YEARLY_GOALS_YEAR_FIELDS[year];
  const actual = yearFields ? activity.fields?.[yearFields.actual] : undefined;
  const target = yearFields ? activity.fields?.[yearFields.target] : undefined;

  return (
    <Card
      size="sm"
      variant="outline"
      cursor="pointer"
      _hover={{ borderColor: 'blue.400', shadow: 'sm' }}
      onClick={() => props.onOpen(activity._id)}
    >
      <CardBody p={3}>
        {category && <Badge colorScheme={categoryColor} mb={2}>{category}</Badge>}
        <Text fontWeight="medium" fontSize="sm" noOfLines={2} mb={2}>
          {metric || activity.name}
        </Text>
        <HStack justify="space-between">
          <Text fontSize="xs" color="subtleText">{year} Actual / Target</Text>
          <Text fontSize="md" fontWeight="bold">
            <Text as="span" color={progressColor(actual, target)}>{fmt(actual)}</Text>
            <Text as="span" color="subtleText"> / {fmt(target)}</Text>
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
}
