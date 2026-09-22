import { Activity } from '@hailer/app-sdk';
import { Badge, Box, Card, CardBody, HStack, Icon, Image, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { HailerImage as HailerImageIcon } from '../hailer/theme/icons/HailerImage';
import { HailerLink } from '../hailer/theme/icons/HailerLink';
import { LinkedInFieldIds, LinkedInPhaseMeta } from '../hailer/workspace-ids';

function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'number') return undefined;
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function firstFileId(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0];
  } catch {
    // no photo
  }
  return undefined;
}

export default function LinkedInPostCard(props: { activity: Activity; onOpen: (id: string) => void; showPhaseBadge?: boolean }) {
  const { activity } = props;
  const [imgFailed, setImgFailed] = useState(false);

  const fileId = firstFileId(activity.fields?.[LinkedInFieldIds.photos]);
  const contentType = activity.fields?.[LinkedInFieldIds.contentType] as string | undefined;
  const scheduled = formatDate(activity.fields?.[LinkedInFieldIds.scheduledDate]);
  const published = formatDate(activity.fields?.[LinkedInFieldIds.publishedDate]);
  const clientMentioned = activity.fields?.[LinkedInFieldIds.clientMentioned] as string | undefined;
  const postUrl = activity.fields?.[LinkedInFieldIds.postUrl] as string | undefined;
  const phaseMeta = activity.currentPhase ? LinkedInPhaseMeta[activity.currentPhase] : undefined;

  return (
    <Card
      size="sm"
      variant="outline"
      overflow="hidden"
      cursor="pointer"
      _hover={{ borderColor: 'blue.400', shadow: 'sm' }}
      onClick={() => props.onOpen(activity._id)}
    >
      <Box position="relative" bg="gray.100" aspectRatio={1}>
        {fileId && !imgFailed ? (
          <Image
            src={`https://api.hailer.com/image/gallerycover/${fileId}`}
            alt={activity.name}
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
            <Icon as={HailerImageIcon} boxSize="30%" color="gray.300" />
          </Box>
        )}
        {clientMentioned === 'Yes' && (
          <Badge position="absolute" top={2} right={2} colorScheme="orange">Client</Badge>
        )}
      </Box>
      <CardBody p={3}>
        {props.showPhaseBadge !== false && phaseMeta && (
          <Badge colorScheme={phaseMeta.color} mb={2}>{phaseMeta.name}</Badge>
        )}
        <Text fontWeight="medium" fontSize="sm" noOfLines={2} mb={1}>
          {activity.name}
        </Text>
        <HStack fontSize="xs" color="subtleText" justify="space-between">
          <Text>{contentType || '—'}</Text>
          <Text>{published ? `Published ${published}` : scheduled ? `Sched. ${scheduled}` : '—'}</Text>
        </HStack>
        {postUrl && (
          <Link
            href={postUrl}
            isExternal
            fontSize="xs"
            color="blue.500"
            display="inline-flex"
            alignItems="center"
            mt={1}
            onClick={e => e.stopPropagation()}
          >
            <Icon as={HailerLink} boxSize={3} mr={1} /> View post
          </Link>
        )}
      </CardBody>
    </Card>
  );
}
