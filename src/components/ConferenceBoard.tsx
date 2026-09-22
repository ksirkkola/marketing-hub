import { useMemo, useState } from 'react';
import { Activity } from '@hailer/app-sdk';
import { Button, Collapse, Flex, HStack, SimpleGrid, Text } from '@chakra-ui/react';
import CardList from './CardList';
import ConferenceCard from './ConferenceCard';
import StatCard from './StatCard';
import { HailerPlus } from '../hailer/theme/icons/HailerPlus';
import { HailerChevron } from '../hailer/theme/icons/HailerChevron';
import { ConferenceFieldIds, ConferencePhaseIds, ConferencePhaseMeta } from '../hailer/workspace-ids';

const DONE_OR_CANCELLED = new Set<string>([ConferencePhaseIds.done, ConferencePhaseIds.cancelled]);

function sortByDate(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    const aVal = a.fields?.[ConferenceFieldIds.conferenceDates] as { start: number } | undefined;
    const bVal = b.fields?.[ConferenceFieldIds.conferenceDates] as { start: number } | undefined;
    return (aVal?.start || 0) - (bVal?.start || 0);
  });
}

export default function ConferenceBoard(props: {
  activities: Activity[];
  loading: boolean;
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  const active = sortByDate(props.activities.filter(a => !DONE_OR_CANCELLED.has(a.currentPhase ?? '')));
  const completed = sortByDate(props.activities.filter(a => DONE_OR_CANCELLED.has(a.currentPhase ?? '')));

  const phaseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of Object.values(ConferencePhaseIds)) counts[id] = 0;
    for (const a of props.activities) {
      if (a.currentPhase && counts[a.currentPhase] !== undefined) counts[a.currentPhase] += 1;
    }
    return counts;
  }, [props.activities]);

  return (
    <>
      <Flex justify="flex-end" mb={3}>
        <Button colorScheme="green" leftIcon={<HailerPlus />} onClick={props.onCreate}>
          Add New Conference
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={3}>
        <StatCard label="Total Conferences" value={props.activities.length} accentColor="gray" />
        <StatCard
          label="Onsite Execution"
          value={phaseCounts[ConferencePhaseIds.onsiteExecution]}
          accentColor="orange"
          valueColor="orange.400"
        />
        <StatCard
          label="Done"
          value={phaseCounts[ConferencePhaseIds.done]}
          accentColor="green"
          valueColor="green.400"
        />
        <StatCard
          label="Cancelled"
          value={phaseCounts[ConferencePhaseIds.cancelled]}
          accentColor="red"
          valueColor="red.400"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={3} mb={4}>
        {Object.values(ConferencePhaseIds).map(id => (
          <StatCard
            key={id}
            label={ConferencePhaseMeta[id].name}
            value={phaseCounts[id]}
            accentColor={ConferencePhaseMeta[id].color}
          />
        ))}
      </SimpleGrid>

      <CardList
        activities={active}
        loading={props.loading}
        emptyText="No upcoming conferences tracked yet."
        renderCard={activity => <ConferenceCard activity={activity} onOpen={props.onOpen} />}
      />

      {completed.length > 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            mt={6}
            mb={2}
            onClick={() => setShowCompleted(v => !v)}
          >
            <HStack spacing={2}>
              <HailerChevron
                transform={showCompleted ? 'rotate(0deg)' : 'rotate(-90deg)'}
                transition="transform 0.15s"
              />
              <Text>Completed / Cancelled ({completed.length})</Text>
            </HStack>
          </Button>
          <Collapse in={showCompleted} animateOpacity>
            <CardList
              activities={completed}
              loading={props.loading}
              emptyText=""
              renderCard={activity => <ConferenceCard activity={activity} onOpen={props.onOpen} />}
            />
          </Collapse>
        </>
      )}
    </>
  );
}
