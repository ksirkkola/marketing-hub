import { Card, CardBody, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function StatCard(props: {
  label: string;
  value: ReactNode;
  accentColor?: string;
  valueColor?: string;
}) {
  return (
    <Card size="sm" borderTop="3px solid" borderColor={`${props.accentColor ?? 'gray'}.400`} flex="1" minW="130px">
      <CardBody py={3} px={4}>
        <Text fontSize="sm" color="subtleText" mb={1} noOfLines={1}>{props.label}</Text>
        <Text fontSize="2xl" fontWeight="bold" color={props.valueColor}>{props.value}</Text>
      </CardBody>
    </Card>
  );
}
