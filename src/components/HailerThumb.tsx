import { Box, Icon, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { HailerImage as HailerImageIcon } from '../hailer/theme/icons/HailerImage';

/**
 * Renders the first image from a `modifier.file` field's JSON-stringified id array
 * as a small thumbnail. Falls back to a placeholder icon when there's no photo yet,
 * or the request fails (e.g. missing workflow-read permission).
 */
export function HailerThumb(props: { fileFieldValue: unknown; size?: string }) {
  const size = props.size ?? '40px';
  const [failed, setFailed] = useState(false);

  let firstId: string | undefined;
  if (typeof props.fileFieldValue === 'string' && props.fileFieldValue) {
    try {
      const parsed = JSON.parse(props.fileFieldValue);
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') firstId = parsed[0];
    } catch {
      // not JSON — no photo
    }
  }

  if (!firstId || failed) {
    return (
      <Box boxSize={size} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="md">
        <Icon as={HailerImageIcon} boxSize="60%" color="gray.300" />
      </Box>
    );
  }

  return (
    <Image
      src={`https://api.hailer.com/image/thumb/${firstId}`}
      alt="Photo"
      boxSize={size}
      objectFit="cover"
      borderRadius="md"
      onError={() => setFailed(true)}
    />
  );
}
