import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Flex, Heading, HStack, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip,
} from '@chakra-ui/react';
import { Activity } from '@hailer/app-sdk';
import { useApp } from './hailer/use-app';
import { listAllPhases } from './hailer/list-all';
import {
  WorkflowIds, LinkedInFieldIds, LinkedInPhaseIds, ConferenceFieldIds, ConferencePhaseIds,
  YearlyGoalsPhaseIds, QuarterlyPhaseIds, MonthlyFocusPhaseIds,
} from './hailer/workspace-ids';
import LinkedInBoard from './components/LinkedInBoard';
import ConferenceBoard from './components/ConferenceBoard';
import YearlyGoalsBoard from './components/YearlyGoalsBoard';
import StatusBanner, { StatusBannerItem } from './components/StatusBanner';
import { HailerRefresh } from './hailer/theme/icons/HailerRefresh';

const DAY_MS = 24 * 60 * 60 * 1000;
const TAB_LINKEDIN = 0;
const TAB_CONFERENCES = 1;

const LINKEDIN_PHASES = Object.values(LinkedInPhaseIds);
const CONFERENCE_PHASES = Object.values(ConferencePhaseIds);
const YEARLY_GOALS_PHASES = Object.values(YearlyGoalsPhaseIds);
const QUARTERLY_PHASES = Object.values(QuarterlyPhaseIds);
const MONTHLY_FOCUS_PHASES = Object.values(MonthlyFocusPhaseIds);

export default function App() {
  const { hailer, api, inside, event } = useApp();

  const [linkedInPosts, setLinkedInPosts] = useState<Activity[]>([]);
  const [conferences, setConferences] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Activity[]>([]);
  const [quarterlyInitiatives, setQuarterlyInitiatives] = useState<Activity[]>([]);
  const [monthlyFocus, setMonthlyFocus] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const loadAll = useCallback(async () => {
    if (!hailer) return;
    setLoading(true);
    try {
      const [li, conf, yg, qi, mf] = await Promise.all([
        listAllPhases(hailer, WorkflowIds.linkedInContentCalendar, LINKEDIN_PHASES),
        listAllPhases(hailer, WorkflowIds.conferenceTracking, CONFERENCE_PHASES),
        listAllPhases(hailer, WorkflowIds.yearlyGoals, YEARLY_GOALS_PHASES),
        listAllPhases(hailer, WorkflowIds.quarterlyInitiatives, QUARTERLY_PHASES),
        listAllPhases(hailer, WorkflowIds.monthlyFocus, MONTHLY_FOCUS_PHASES),
      ]);
      setLinkedInPosts(li);
      setConferences(conf);
      setGoals(yg);
      setQuarterlyInitiatives(qi);
      setMonthlyFocus(mf);
      setUpdatedAt(new Date());
    } catch (error) {
      console.error('Failed to load Marketing Hub data:', error);
    } finally {
      setLoading(false);
    }
  }, [hailer]);

  useEffect(() => {
    void api.init();
  }, [api]);

  useEffect(() => {
    if (inside) void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inside]);

  // Real-time refresh on activity changes to our three workflows — debounced, skipped
  // right after mount to avoid a signal-replay storm.
  const mountedAt = useRef(Date.now());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const relevantWorkflowIds = new Set([
    WorkflowIds.linkedInContentCalendar,
    WorkflowIds.conferenceTracking,
    WorkflowIds.yearlyGoals,
    WorkflowIds.quarterlyInitiatives,
    WorkflowIds.monthlyFocus,
  ]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (data: any) => {
      if (Date.now() - mountedAt.current < 3000) return;
      const wfId = data?.workflowId ?? data?.process ?? data?.processId;
      if (wfId && !relevantWorkflowIds.has(wfId)) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => void loadAll(), 800);
    };

    event.on('activity.create', handler);
    event.on('activity.update', handler);
    event.on('activity.delete', handler);

    return () => {
      event.off('activity.create', handler);
      event.off('activity.update', handler);
      event.off('activity.delete', handler);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, loadAll]);

  const openActivity = useCallback((activityId: string) => {
    if (!hailer) return;
    void hailer.ui.activity.open(activityId, { tab: 'detail' });
  }, [hailer]);

  const createActivity = useCallback((workflowId: string) => {
    if (!hailer) return;
    // Fire-and-forget: the promise never settles if the user cancels the create
    // sidebar (known app-sdk v2 behavior), so we don't await it directly.
    void hailer.ui.activity.create(workflowId).then(result => {
      if (result) void loadAll();
    });
  }, [hailer, loadAll]);

  const createLinkedInPost = useCallback(
    () => createActivity(WorkflowIds.linkedInContentCalendar),
    [createActivity],
  );
  const createConference = useCallback(
    () => createActivity(WorkflowIds.conferenceTracking),
    [createActivity],
  );

  // Status banner signals — generic enough that adding a third/fourth callout later (more
  // tabs, more things worth surfacing) is just another entry below, nothing structural.
  const bannerItems: StatusBannerItem[] = useMemo(() => {
    const now = Date.now();
    const weekOut = now + 7 * DAY_MS;
    const monthOut = now + 30 * DAY_MS;

    const postsDueSoon = linkedInPosts.filter((a) => {
      if (a.currentPhase !== LinkedInPhaseIds.scheduled) return false;
      const scheduledDate = a.fields?.[LinkedInFieldIds.scheduledDate] as number | undefined;
      return typeof scheduledDate === 'number' && scheduledDate <= weekOut;
    }).length;

    const upcomingConferences = conferences.filter((a) => {
      if (a.currentPhase === ConferencePhaseIds.done || a.currentPhase === ConferencePhaseIds.cancelled) return false;
      const range = a.fields?.[ConferenceFieldIds.conferenceDates] as { start?: number } | undefined;
      const start = range?.start;
      return typeof start === 'number' && start >= now && start <= monthOut;
    }).length;

    return [
      {
        icon: '📅', label: `LinkedIn post${postsDueSoon === 1 ? '' : 's'} due this week`,
        count: postsDueSoon, color: 'orange', onClick: () => setTabIndex(TAB_LINKEDIN),
      },
      {
        icon: '🎤', label: `upcoming conference${upcomingConferences === 1 ? '' : 's'} (next 30 days)`,
        count: upcomingConferences, color: 'blue', onClick: () => setTabIndex(TAB_CONFERENCES),
      },
    ];
  }, [linkedInPosts, conferences]);

  if (!inside) {
    return (
      <Box p={8}>
        <Text color="subtleText">This app must be opened inside Hailer.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1400px" mx="auto">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">📣 Marketing Hub</Heading>
        <HStack spacing={3}>
          {updatedAt && (
            <Text fontSize="sm" color="subtleText">
              Updated {updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
          <Tooltip variant="hailer" label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<HailerRefresh />}
              size="sm"
              variant="ghost"
              isLoading={loading}
              onClick={() => void loadAll()}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {!loading && <StatusBanner items={bannerItems} />}

      <Tabs variant="hailer" isLazy index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>📅 LinkedIn Content Calendar</Tab>
          <Tab>🎤 Conference Tracking</Tab>
          <Tab>🎯 5-Year Marketing Goals</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LinkedInBoard
              activities={linkedInPosts}
              loading={loading}
              onOpen={openActivity}
              onCreate={createLinkedInPost}
            />
          </TabPanel>
          <TabPanel>
            <ConferenceBoard
              activities={conferences}
              loading={loading}
              onOpen={openActivity}
              onCreate={createConference}
            />
          </TabPanel>
          <TabPanel>
            <YearlyGoalsBoard
              activities={goals}
              quarterlyInitiatives={quarterlyInitiatives}
              monthlyFocus={monthlyFocus}
              loading={loading}
              onOpen={openActivity}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
