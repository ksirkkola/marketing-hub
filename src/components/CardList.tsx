import { SimpleGrid, Text } from '@chakra-ui/react';
import { Activity } from '@hailer/app-sdk';
import { ReactNode } from 'react';

export default function CardList(props: {
  activities: Activity[];
  loading: boolean;
  emptyText: string;
  renderCard: (activity: Activity) => ReactNode;
  minCardWidth?: string;
}) {
  if (!props.loading && props.activities.length === 0) {
    return <Text color="subtleText" p={4}>{props.emptyText}</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} minChildWidth={props.minCardWidth ?? '260px'}>
      {props.activities.map(activity => (
        <div key={activity._id}>{props.renderCard(activity)}</div>
      ))}
    </SimpleGrid>
  );
}
