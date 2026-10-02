import { Box, HStack, Text, useColorModeValue, Wrap, WrapItem } from '@chakra-ui/react';

// A row of at-a-glance callouts, each optionally clickable to jump to the relevant tab.
// Built as a generic list so new signals (more tabs, more things worth surfacing) are just
// another entry in the `items` array — nothing structural to change here.
export interface StatusBannerItem {
  icon: string;
  label: string;
  count: number;
  // Only colored/attention-grabbing when there's something to act on; muted at zero so the
  // banner reads as "all clear" rather than flagging empty states as if they were urgent.
  color: string;
  onClick?: () => void;
}

export default function StatusBanner({ items }: { items: StatusBannerItem[] }) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedBorder = useColorModeValue('gray.100', 'gray.700');
  const mutedText = useColorModeValue('gray.500', 'gray.400');

  return (
    <Wrap spacing={3} mb={4}>
      {items.map((item) => {
        const active = item.count > 0;
        return (
          <WrapItem key={item.label}>
            <Box
              bg={cardBg}
              border="1px"
              borderColor={active ? `${item.color}.300` : mutedBorder}
              borderRadius="full"
              px={4}
              py={1.5}
              cursor={item.onClick ? 'pointer' : 'default'}
              transition="all 0.15s ease"
              _hover={item.onClick ? { borderColor: active ? `${item.color}.400` : borderColor, shadow: 'sm' } : undefined}
              onClick={item.onClick}
            >
              <HStack spacing={2}>
                <Text fontSize="sm">{item.icon}</Text>
                <Text fontSize="sm" fontWeight={active ? 'semibold' : 'normal'} color={active ? `${item.color}.500` : mutedText}>
                  {item.count} {item.label}
                </Text>
              </HStack>
            </Box>
          </WrapItem>
        );
      })}
    </Wrap>
  );
}
