// Hand-written resolver (this app was manually scaffolded, not via `hailer-mcp bootstrap`).
// IDs copied from workspace/enums.ts — never hardcode hex elsewhere in the app.

export const WorkflowIds = {
  linkedInContentCalendar: '6aa7e19eac7a491dd7f42fe4',
  conferenceTracking: '6a192ecf0965f762b3ea50b9',
  yearlyGoals: '6aa7e19bac7a491dd7f42fb1',
  quarterlyInitiatives: '6aa7e19cac7a491dd7f42fbf',
  monthlyFocus: '6aa7e19dac7a491dd7f42fd1',
} as const;

export const YEARS = ['2026', '2027', '2028', '2029', '2030'] as const;

export const LinkedInFieldIds = {
  contentType: '6aa7e232a2efc3a966770e61',
  contentCopy: '6aa7e232a2efc3a966770e64',
  hashtags: '6aa7e232a2efc3a966770e6a',
  scheduledDate: '6aa7e232a2efc3a966770e6d',
  publishedDate: '6aa7e232a2efc3a966770e70',
  postUrl: '6aa7e233a2efc3a966770e73',
  clientMentioned: '6aa7e5eee4ca808ca455dc22',
  photos: '6aab7d381aff6ae7eef9f814',
  wasBoosted: '6aab8eda1aff6ae7eefa93ab',
  howMuchWasSpent: '6aab8ef11aff6ae7eefa94b8',
  howManyDays: '6aab8f081aff6ae7eefa95b1',
} as const;

export const LinkedInPhaseIds = {
  idea: '6aa7e19eac7a491dd7f42fe3',
  drafting: '6aa7e214a2efc3a966770c88',
  pendingReview: '6aa7e61ba2efc3a966772f74',
  scheduled: '6aa7e216a2efc3a966770ca8',
  posted: '6aa7e218a2efc3a966770cd2',
  archived: '6aa7e21ba2efc3a966770ced',
} as const;

export const LinkedInPhaseMeta: Record<string, { name: string; color: string }> = {
  [LinkedInPhaseIds.idea]: { name: 'Idea', color: 'gray' },
  [LinkedInPhaseIds.drafting]: { name: 'Drafting', color: 'blue' },
  [LinkedInPhaseIds.pendingReview]: { name: 'Pending Review', color: 'purple' },
  [LinkedInPhaseIds.scheduled]: { name: 'Scheduled', color: 'orange' },
  [LinkedInPhaseIds.posted]: { name: 'Posted', color: 'green' },
  [LinkedInPhaseIds.archived]: { name: 'Archived', color: 'gray' },
};

export const ConferenceFieldIds = {
  conferenceCode: '6a192ed10965f762b3ea5102',
  conferenceDates: '6a1c5c80c063208b5c4a4746',
  location: '6a1c5ccac063208b5c4a47dd',
  registrationDeadline: '6a1c5e88c063208b5c4a4a52',
  conferenceActivity: '6a1ff594854f9c8903df9e32',
  registration: '6aab94f1ada981060cc0914e',
  boothBuildPreferences: '6aab94f1ada981060cc09151',
  manikinTransportationTo: '6aab94f1ada981060cc09154',
  manikinTransportationFrom: '6aab94f1ada981060cc09157',
  travelBooked: '6aab94f1ada981060cc0915a',
  hotelBooked: '6aab94f1ada981060cc0915d',
  pamphletsOrdered: '6aa7e186a2efc3a9667709a3',
  boothInfoReceived: '6aa7e186a2efc3a9667709a6',
  giveawaysOrdered: '6aa7e187a2efc3a9667709aa',
  businessCardsStocked: '6aa7e187a2efc3a9667709ad',
} as const;

export const CONFERENCE_CHECKLIST = [
  { fieldId: ConferenceFieldIds.registration, label: 'Registration' },
  { fieldId: ConferenceFieldIds.boothBuildPreferences, label: 'Booth Build Preferences' },
  { fieldId: ConferenceFieldIds.manikinTransportationTo, label: 'Manikin Transportation To' },
  { fieldId: ConferenceFieldIds.manikinTransportationFrom, label: 'Manikin Transportation From' },
  { fieldId: ConferenceFieldIds.travelBooked, label: 'Travel Booked' },
  { fieldId: ConferenceFieldIds.hotelBooked, label: 'Hotel Booked' },
  { fieldId: ConferenceFieldIds.pamphletsOrdered, label: 'Pamphlets / Marketing Materials' },
  { fieldId: ConferenceFieldIds.boothInfoReceived, label: 'Booth Information' },
  { fieldId: ConferenceFieldIds.giveawaysOrdered, label: 'Giveaways / Swag' },
  { fieldId: ConferenceFieldIds.businessCardsStocked, label: 'Business Cards' },
] as const;

export const ConferencePhaseIds = {
  newConference: '6a192ed10965f762b3ea50e9',
  planning: '6a192ed10965f762b3ea50ef',
  preEventOutreach: '6a192ed10965f762b3ea50ee',
  onsiteExecution: '6a192fd00965f762b3ea5f32',
  followUp: '6a192fdd0965f762b3ea604f',
  roiReview: '6a192ed10965f762b3ea50ed',
  done: '6a192ed10965f762b3ea50eb',
  cancelled: '6a9b236cc5bea9058b3626d5',
} as const;

export const ConferencePhaseMeta: Record<string, { name: string; color: string }> = {
  [ConferencePhaseIds.newConference]: { name: 'New Conference', color: 'gray' },
  [ConferencePhaseIds.planning]: { name: 'Planning', color: 'blue' },
  [ConferencePhaseIds.preEventOutreach]: { name: 'Pre-Event Outreach', color: 'purple' },
  [ConferencePhaseIds.onsiteExecution]: { name: 'Onsite Execution', color: 'orange' },
  [ConferencePhaseIds.followUp]: { name: 'Follow-Up', color: 'teal' },
  [ConferencePhaseIds.roiReview]: { name: 'ROI Review', color: 'cyan' },
  [ConferencePhaseIds.done]: { name: 'Done', color: 'green' },
  [ConferencePhaseIds.cancelled]: { name: 'Cancelled', color: 'red' },
};

export const YearlyGoalsFieldIds = {
  category: '6aa7e234a2efc3a966770ec8',
  metric: '6aa7e234a2efc3a966770ecb',
  target2026: '6aa7e234a2efc3a966770ece',
  target2027: '6aa7e234a2efc3a966770ed1',
  target2028: '6aa7e234a2efc3a966770ed4',
  target2029: '6aa7e234a2efc3a966770ed7',
  target2030: '6aa7e234a2efc3a966770eda',
  notes: '6aa7e234a2efc3a966770edd',
  actual2026: '6aa7f7bfa2efc3a966778e59',
  actual2027: '6aa7f7bfa2efc3a966778e5c',
  actual2028: '6aa7f7bfa2efc3a966778e5f',
  actual2029: '6aa7f7bfa2efc3a966778e62',
  actual2030: '6aa7f7bfa2efc3a966778e65',
} as const;

export const YearlyGoalsPhaseIds = {
  newPhase: '6aa7e19bac7a491dd7f42fb0',
} as const;

export const YEARLY_GOALS_YEAR_FIELDS: Record<string, { target: string; actual: string }> = {
  '2026': { target: YearlyGoalsFieldIds.target2026, actual: YearlyGoalsFieldIds.actual2026 },
  '2027': { target: YearlyGoalsFieldIds.target2027, actual: YearlyGoalsFieldIds.actual2027 },
  '2028': { target: YearlyGoalsFieldIds.target2028, actual: YearlyGoalsFieldIds.actual2028 },
  '2029': { target: YearlyGoalsFieldIds.target2029, actual: YearlyGoalsFieldIds.actual2029 },
  '2030': { target: YearlyGoalsFieldIds.target2030, actual: YearlyGoalsFieldIds.actual2030 },
};

// textpredefinedoptions values from workspace/yearly_goals_.../fields.ts — must match exactly.
export const YEARLY_GOALS_CATEGORIES: { id: string; color: string }[] = [
  { id: 'System Sales', color: 'blue' },
  { id: 'InHouse Testing', color: 'purple' },
  { id: 'Calibration Sales', color: 'teal' },
  { id: 'Online Store Sales', color: 'cyan' },
  { id: 'Manufacturing', color: 'orange' },
  { id: 'Market', color: 'pink' },
  { id: 'Brand', color: 'yellow' },
];

export const QuarterlyFieldIds = {
  year: '6aa7e234a2efc3a966770eae',
  linkedGoal: '6aa7e234a2efc3a966770eb1',
  goalName: '6aa7e234a2efc3a966770eb4',
  kpiTarget: '6aa7e234a2efc3a966770eb7',
  q1Notes: '6aa7e234a2efc3a966770eba',
  q2Notes: '6aa7e234a2efc3a966770ebe',
  q3Notes: '6aa7e234a2efc3a966770ec1',
  q4Notes: '6aa7e234a2efc3a966770ec4',
} as const;

export const QuarterlyPhaseIds = {
  notStarted: '6aa7e19cac7a491dd7f42fbe',
  inProgress: '6aa7e1e1477a2c5b80032d94',
  onTrack: '6aa7e1e3477a2c5b80032daf',
  atRisk: '6aa7e1e5477a2c5b80032dd4',
  achieved: '6aa7e1e8477a2c5b80032df8',
  missed: '6aa7e1ea477a2c5b80032e13',
} as const;

export const QuarterlyPhaseMeta: Record<string, { name: string; color: string }> = {
  [QuarterlyPhaseIds.notStarted]: { name: 'Not Started', color: 'gray' },
  [QuarterlyPhaseIds.inProgress]: { name: 'In Progress', color: 'blue' },
  [QuarterlyPhaseIds.onTrack]: { name: 'On Track', color: 'green' },
  [QuarterlyPhaseIds.atRisk]: { name: 'At Risk', color: 'orange' },
  [QuarterlyPhaseIds.achieved]: { name: 'Achieved', color: 'teal' },
  [QuarterlyPhaseIds.missed]: { name: 'Missed', color: 'red' },
};

export const MonthlyFocusFieldIds = {
  year: '6aa7e233a2efc3a966770e8f',
  month: '6aa7e233a2efc3a966770e94',
  priority1: '6aa7e233a2efc3a966770e9d',
  priority2: '6aa7e233a2efc3a966770ea1',
  priority3: '6aa7e234a2efc3a966770ea6',
  keyOutcome: '6aa7e234a2efc3a966770eab',
} as const;

export const MonthlyFocusPhaseIds = {
  newPhase: '6aa7e19dac7a491dd7f42fd0',
} as const;

export const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
