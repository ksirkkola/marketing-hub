import { useMemo, useState } from 'react';
import { Activity } from '@hailer/app-sdk';
import { Button, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import CardList from './CardList';
import YearlyGoalCard from './YearlyGoalCard';
import QuarterlyInitiativeCard from './QuarterlyInitiativeCard';
import MonthlyFocusTable from './MonthlyFocusTable';
import StatCard from './StatCard';
import RevenueTrajectoryChart from './RevenueTrajectoryChart';
import CategoryRevenueChart from './CategoryRevenueChart';
import {
  YEARLY_GOALS_CATEGORIES, YearlyGoalsFieldIds, YEARS,
  QuarterlyFieldIds, MonthlyFocusFieldIds,
} from '../hailer/workspace-ids';

export default function YearlyGoalsBoard(props: {
  activities: Activity[];
  quarterlyInitiatives: Activity[];
  monthlyFocus: Activity[];
  loading: boolean;
  onOpen: (id: string) => void;
}) {
  const [year, setYear] = useState<string>(YEARS[0]);

  const sortedGoals = [...props.activities].sort((a, b) => {
    const catA = (a.fields?.[YearlyGoalsFieldIds.category] as string) || '';
    const catB = (b.fields?.[YearlyGoalsFieldIds.category] as string) || '';
    return catA.localeCompare(catB) || a.name.localeCompare(b.name);
  });

  const yearQuarterly = useMemo(
    () => props.quarterlyInitiatives.filter(a => a.fields?.[QuarterlyFieldIds.year] === year),
    [props.quarterlyInitiatives, year],
  );

  const yearMonthly = useMemo(
    () => props.monthlyFocus.filter(a => a.fields?.[MonthlyFocusFieldIds.year] === year),
    [props.monthlyFocus, year],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of YEARLY_GOALS_CATEGORIES) counts[c.id] = 0;
    for (const a of props.activities) {
      const cat = a.fields?.[YearlyGoalsFieldIds.category] as string | undefined;
      if (cat && counts[cat] !== undefined) counts[cat] += 1;
    }
    return counts;
  }, [props.activities]);

  return (
    <VStack align="stretch" spacing={6}>
      <HStack spacing={2}>
        {YEARS.map(y => (
          <Button
            key={y}
            size="sm"
            variant={y === year ? 'solid' : 'outline'}
            colorScheme={y === year ? 'green' : 'gray'}
            onClick={() => setYear(y)}
          >
            {y}
          </Button>
        ))}
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
        <RevenueTrajectoryChart activities={props.activities} />
        <CategoryRevenueChart activities={props.activities} year={year} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={3}>
        {YEARLY_GOALS_CATEGORIES.map(c => (
          <StatCard key={c.id} label={c.id} value={categoryCounts[c.id]} accentColor={c.color} />
        ))}
      </SimpleGrid>

      <VStack align="stretch" spacing={3}>
        <Heading size="sm">🎯 {year} Goals — Target vs. Actual</Heading>
        <CardList
          activities={sortedGoals}
          loading={props.loading}
          emptyText="No yearly goals set yet."
          renderCard={activity => <YearlyGoalCard activity={activity} year={year} onOpen={props.onOpen} />}
        />
      </VStack>

      <VStack align="stretch" spacing={3}>
        <Heading size="sm">📋 {year} Quarterly Initiatives</Heading>
        <CardList
          activities={yearQuarterly}
          loading={props.loading}
          emptyText={`No quarterly initiatives logged for ${year} yet.`}
          renderCard={activity => <QuarterlyInitiativeCard activity={activity} onOpen={props.onOpen} />}
          minCardWidth="320px"
        />
      </VStack>

      <VStack align="stretch" spacing={3}>
        <Heading size="sm">🗓️ {year} Monthly Focus</Heading>
        <MonthlyFocusTable activities={yearMonthly} onOpen={props.onOpen} />
      </VStack>
    </VStack>
  );
}
