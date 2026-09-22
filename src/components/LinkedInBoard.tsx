import { useMemo, useState } from 'react';
import { Activity } from '@hailer/app-sdk';
import {
  Badge, Button, Flex, Icon, Input, InputGroup, InputLeftElement, Link, Select,
  SimpleGrid, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr,
} from '@chakra-ui/react';
import StatCard from './StatCard';
import { HailerThumb } from './HailerThumb';
import SortableTh, { SortDirection } from './SortableTh';
import { HailerSearch } from '../hailer/theme/icons/HailerSearch';
import { HailerPlus } from '../hailer/theme/icons/HailerPlus';
import { LinkedInFieldIds, LinkedInPhaseIds, LinkedInPhaseMeta } from '../hailer/workspace-ids';

const CONTENT_TYPES = ['Text Post', 'Image Post', 'Video', 'Article', 'Poll', 'Carousel', 'Document'];

type SortField = 'post' | 'type' | 'phase' | 'scheduled' | 'published' | 'client' | 'boosted';

function formatDate(value: unknown): string {
  if (typeof value !== 'number') return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function sortValue(a: Activity, field: SortField): string | number {
  switch (field) {
    case 'post': return a.name.toLowerCase();
    case 'type': return (a.fields?.[LinkedInFieldIds.contentType] as string) || '';
    case 'phase': return (a.currentPhase ? LinkedInPhaseMeta[a.currentPhase]?.name : '') || '';
    case 'scheduled': return (a.fields?.[LinkedInFieldIds.scheduledDate] as number) || 0;
    case 'published': return (a.fields?.[LinkedInFieldIds.publishedDate] as number) || 0;
    case 'client': return (a.fields?.[LinkedInFieldIds.clientMentioned] as string) || '';
    case 'boosted': return (a.fields?.[LinkedInFieldIds.wasBoosted] as string) || '';
    default: return '';
  }
}

export default function LinkedInBoard(props: {
  activities: Activity[];
  loading: boolean;
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [boostedFilter, setBoostedFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('scheduled');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const phaseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of Object.values(LinkedInPhaseIds)) counts[id] = 0;
    for (const a of props.activities) {
      if (a.currentPhase && counts[a.currentPhase] !== undefined) counts[a.currentPhase] += 1;
    }
    return counts;
  }, [props.activities]);

  const scheduledCount = props.activities.filter(a => a.currentPhase === LinkedInPhaseIds.scheduled).length;
  const postedCount = props.activities.filter(a => a.currentPhase === LinkedInPhaseIds.posted).length;
  const boostedCount = props.activities.filter(a => a.fields?.[LinkedInFieldIds.wasBoosted] === 'Yes').length;

  const filtered = useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...props.activities]
      .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()))
      .filter(a => !typeFilter || a.fields?.[LinkedInFieldIds.contentType] === typeFilter)
      .filter(a => !phaseFilter || a.currentPhase === phaseFilter)
      .filter(a => !clientFilter || (a.fields?.[LinkedInFieldIds.clientMentioned] as string | undefined ?? 'No') === clientFilter)
      .filter(a => !boostedFilter || (a.fields?.[LinkedInFieldIds.wasBoosted] as string | undefined ?? 'No') === boostedFilter)
      .sort((a, b) => {
        const av = sortValue(a, sortField);
        const bv = sortValue(b, sortField);
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
  }, [props.activities, search, typeFilter, phaseFilter, clientFilter, boostedFilter, sortField, sortDirection]);

  const hasActiveFilters = Boolean(search || typeFilter || phaseFilter || clientFilter || boostedFilter);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setPhaseFilter('');
    setClientFilter('');
    setBoostedFilter('');
  };

  return (
    <>
      <Flex justify="flex-end" mb={3}>
        <Button colorScheme="green" leftIcon={<HailerPlus />} onClick={props.onCreate}>
          Add New Post
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
        <StatCard label="Total Posts" value={props.activities.length} accentColor="gray" />
        <StatCard label="Scheduled" value={scheduledCount} accentColor="orange" valueColor="orange.400" />
        <StatCard label="Posted" value={postedCount} accentColor="green" valueColor="green.400" />
        <StatCard label="Boosted" value={boostedCount} accentColor="pink" valueColor="pink.400" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3} mb={4}>
        {Object.values(LinkedInPhaseIds).map(id => (
          <StatCard
            key={id}
            label={LinkedInPhaseMeta[id].name}
            value={phaseCounts[id]}
            accentColor={LinkedInPhaseMeta[id].color}
          />
        ))}
      </SimpleGrid>

      <Flex gap={3} mb={4} flexWrap="wrap" align="center">
        <InputGroup maxW="280px">
          <InputLeftElement pointerEvents="none">
            <Icon as={HailerSearch} color="subtleText" />
          </InputLeftElement>
          <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
        </InputGroup>
        <Select maxW="180px" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select maxW="180px" value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
          <option value="">All Phases</option>
          {Object.values(LinkedInPhaseIds).map(id => (
            <option key={id} value={id}>{LinkedInPhaseMeta[id].name}</option>
          ))}
        </Select>
        <Select maxW="180px" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
          <option value="">All (Client?)</option>
          <option value="Yes">Client — Yes</option>
          <option value="No">Client — No</option>
        </Select>
        <Select maxW="180px" value={boostedFilter} onChange={e => setBoostedFilter(e.target.value)}>
          <option value="">All (Boosted?)</option>
          <option value="Yes">Boosted — Yes</option>
          <option value="No">Boosted — No</option>
        </Select>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={clearFilters}>Clear filters</Button>
        )}
        <Text fontSize="sm" color="subtleText">{filtered.length} records</Text>
      </Flex>

      {filtered.length === 0 ? (
        <Text color="subtleText" p={4}>
          {props.loading ? 'Loading…' : 'No posts match your filters.'}
        </Text>
      ) : (
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Photo</Th>
                <SortableTh field="post" label="Post" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="type" label="Type" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="phase" label="Phase" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="scheduled" label="Scheduled" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="published" label="Published" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="client" label="Client?" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <SortableTh field="boosted" label="Boosted" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                <Th>Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map(activity => {
                const phaseMeta = activity.currentPhase ? LinkedInPhaseMeta[activity.currentPhase] : undefined;
                const postUrl = activity.fields?.[LinkedInFieldIds.postUrl] as string | undefined;
                const clientMentioned = activity.fields?.[LinkedInFieldIds.clientMentioned] as string | undefined;
                const wasBoosted = activity.fields?.[LinkedInFieldIds.wasBoosted] as string | undefined;
                const spend = activity.fields?.[LinkedInFieldIds.howMuchWasSpent] as number | undefined;

                return (
                  <Tr
                    key={activity._id}
                    cursor="pointer"
                    _hover={{ bg: 'blackAlpha.100' }}
                    onClick={() => props.onOpen(activity._id)}
                  >
                    <Td>
                      <HailerThumb fileFieldValue={activity.fields?.[LinkedInFieldIds.photos]} />
                    </Td>
                    <Td maxW="320px" whiteSpace="normal">
                      <Text fontWeight="medium" noOfLines={2}>{activity.name}</Text>
                    </Td>
                    <Td>{(activity.fields?.[LinkedInFieldIds.contentType] as string) || '—'}</Td>
                    <Td>
                      {phaseMeta ? (
                        <Badge colorScheme={phaseMeta.color} variant="outline" borderRadius="full" px={2}>
                          {phaseMeta.name.toUpperCase()}
                        </Badge>
                      ) : '—'}
                    </Td>
                    <Td whiteSpace="nowrap">{formatDate(activity.fields?.[LinkedInFieldIds.scheduledDate])}</Td>
                    <Td whiteSpace="nowrap">{formatDate(activity.fields?.[LinkedInFieldIds.publishedDate])}</Td>
                    <Td>
                      <Badge colorScheme={clientMentioned === 'Yes' ? 'orange' : 'gray'} variant="subtle">
                        {clientMentioned === 'Yes' ? 'YES' : 'NO'}
                      </Badge>
                    </Td>
                    <Td whiteSpace="nowrap">
                      <Badge colorScheme={wasBoosted === 'Yes' ? 'pink' : 'gray'} variant="subtle">
                        {wasBoosted === 'Yes' ? 'YES' : 'NO'}
                      </Badge>
                      {wasBoosted === 'Yes' && typeof spend === 'number' && (
                        <Text as="span" fontSize="xs" color="subtleText" ml={1}>
                          €{spend.toLocaleString('en-GB')}
                        </Text>
                      )}
                    </Td>
                    <Td onClick={e => e.stopPropagation()}>
                      {postUrl
                        ? <Link href={postUrl} isExternal color="blue.400">View</Link>
                        : <Text as="span" color="subtleText">—</Text>}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
