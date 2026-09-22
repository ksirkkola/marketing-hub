import { Activity } from '@hailer/app-sdk';
import { Badge, Box, Card, CardBody, Divider, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { HailerTick } from '../hailer/theme/icons/HailerTick';
import { HailerX } from '../hailer/theme/icons/HailerX';
import { ConferenceFieldIds, ConferencePhaseMeta, CONFERENCE_CHECKLIST } from '../hailer/workspace-ids';

function formatDateRange(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('start' in (value as object))) return undefined;
  const r = value as { start: number; end: number };
  const fmt = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${fmt(r.start)} – ${fmt(r.end)}`;
}

function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'number') return undefined;
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ConferenceCard(props: { activity: Activity; onOpen: (id: string) => void }) {
  const { activity } = props;
  const dates = formatDateRange(activity.fields?.[ConferenceFieldIds.conferenceDates]);
  const location = activity.fields?.[ConferenceFieldIds.location] as string | undefined;
  const deadline = formatDate(activity.fields?.[ConferenceFieldIds.registrationDeadline]);
  const code = activity.fields?.[ConferenceFieldIds.conferenceCode] as string | undefined;
  const phaseMeta = activity.currentPhase ? ConferencePhaseMeta[activity.currentPhase] : undefined;

  const doneCount = CONFERENCE_CHECKLIST.filter(item => activity.fields?.[item.fieldId] === 'Yes').length;

  return (
    <Card
      size="sm"
      variant="outline"
      cursor="pointer"
      _hover={{ borderColor: 'blue.400', shadow: 'sm' }}
      onClick={() => props.onOpen(activity._id)}
    >
      <CardBody p={3}>
        {phaseMeta && (
          <Badge colorScheme={phaseMeta.color} mb={2}>{phaseMeta.name}</Badge>
        )}
        <Text fontWeight="medium" fontSize="sm" noOfLines={2} mb={1}>
          {activity.name}
        </Text>
        {code && <Text fontSize="xs" color="subtleText" mb={1}>{code}</Text>}
        {dates && <Text fontSize="xs" color="subtleText">{dates}</Text>}
        {location && <Text fontSize="xs" color="subtleText" noOfLines={1}>{location}</Text>}
        {deadline && <Text fontSize="xs" color="orange.400" mt={1}>Register by {deadline}</Text>}

        <Divider mt={3} mb={2} />
        <Box>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="xs" fontWeight="bold" color="subtleText" textTransform="uppercase">
              Prep checklist
            </Text>
            <Text fontSize="xs" color="subtleText">{doneCount}/{CONFERENCE_CHECKLIST.length}</Text>
          </HStack>
          <VStack align="stretch" spacing={0.5}>
            {CONFERENCE_CHECKLIST.map(item => {
              const done = activity.fields?.[item.fieldId] === 'Yes';
              return (
                <HStack key={item.fieldId} spacing={2}>
                  <Icon
                    as={done ? HailerTick : HailerX}
                    boxSize={3}
                    color={done ? 'green.500' : 'gray.400'}
                  />
                  <Text fontSize="xs" color={done ? undefined : 'subtleText'}>
                    {item.label}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
}
