// Sample team data
export const dummyTeam = [
	{
		id: 1,
		name: '김남혁',
		avatar: '/avatars/alice.jpg',
		color: 'bg-blue-100 text-blue-800 border-blue-200',
		team: 'DO', // Data Operations
	},
	{
		id: 2,
		name: '황수인',
		avatar: '/avatars/bob.jpg',
		color: 'bg-green-100 text-green-800 border-green-200',
		team: 'DO', // Data Operations
	},
	{
		id: 3,
		name: '이채현',
		avatar: '/avatars/carol.jpg',
		color: 'bg-purple-100 text-purple-800 border-purple-200',
		team: 'DA', // Data Analytics
	},
	{
		id: 4,
		name: '김희조',
		avatar: '/avatars/carol.jpg',
		color: 'bg-orange-100 text-orange-800 border-orange-200',
		team: 'DA', // Data Analytics
	},
]

// Team definitions
export const teams = {
	DO: {
		id: 'DO',
		name: 'Data Operations',
		color: 'bg-blue-50 border-blue-200',
		headerColor: 'bg-blue-100 text-blue-800',
	},
	DA: {
		id: 'DA',
		name: 'Data Analytics',
		color: 'bg-purple-50 border-purple-200',
		headerColor: 'bg-purple-100 text-purple-800',
	},
}

// Sample events with start and end dates
export const dummyEvents = [
	{
		id: 1,
		title: 'Project Sprint',
		startDate: new Date(2025, 5, 23), // June 23, 2025
		endDate: new Date(2025, 5, 27), // June 27, 2025
		color: 'bg-blue-500',
		attendees: ['김남혁', '황수인'],
	},
	{
		id: 2,
		title: 'Conference',
		startDate: new Date(2025, 5, 25), // June 25, 2025
		endDate: new Date(2025, 5, 26), // June 26, 2025
		color: 'bg-green-500',
		attendees: ['이채현'],
	},
	{
		id: 3,
		title: 'Workshop',
		startDate: new Date(2025, 5, 29), // June 29, 2025
		endDate: new Date(2025, 6, 11), // July 11, 2025
		color: 'bg-purple-500',
		attendees: ['김희조', '김남혁'],
	},
]

// Office schedule configuration
// Each member has regular office days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export const officeScheduleConfig = [
	{
		memberId: 1,
		regularDays: [2, 4], // Tuesday and Thursday
	},
	{
		memberId: 2,
		regularDays: [1, 3], // Monday and Wednesday
	},
	{
		memberId: 3,
		regularDays: [2, 5], // Tuesday and Friday
	},
	{
		memberId: 4,
		regularDays: [1, 4], // Monday and Thursday
	},
]

// One-time schedule overrides for specific weeks
// Format: { memberId, weekStartDate, newDays }
export const scheduleOverrides = [
	{
		memberId: 1,
		weekStartDate: new Date(2025, 5, 23), // Week of June 23, 2025
		newDays: [1, 5], // Monday and Friday instead of Tuesday/Thursday
	},
	{
		memberId: 3,
		weekStartDate: new Date(2025, 5, 30), // Week of June 30, 2025
		newDays: [3], // Only Wednesday instead of Tuesday/Friday
	},
]

// Holiday data
export const holidays = [
	{
		id: 1,
		name: 'Memorial Day',
		date: new Date(2025, 4, 26), // May 26, 2025 (Monday)
		type: 'federal' as const,
	},
	{
		id: 2,
		name: 'Independence Day',
		date: new Date(2025, 6, 4), // July 4, 2025 (Friday)
		type: 'federal' as const,
	},
	{
		id: 3,
		name: 'Labor Day',
		date: new Date(2025, 8, 1), // September 1, 2025 (Monday)
		type: 'federal' as const,
	},
	{
		id: 4,
		name: 'Thanksgiving',
		date: new Date(2025, 10, 27), // November 27, 2025 (Thursday)
		type: 'federal' as const,
	},
	{
		id: 5,
		name: 'Christmas Day',
		date: new Date(2025, 11, 25), // December 25, 2025 (Thursday)
		type: 'federal' as const,
	},
	{
		id: 6,
		name: 'Company Holiday',
		date: new Date(2025, 5, 30), // June 30, 2025 (Monday)
		type: 'company' as const,
	},
	{
		id: 7,
		name: 'July 4th observed',
		date: new Date(2025, 6, 3), // July 3, 2025 (Thursday)
		type: 'federal' as const,
	},
]

export type TeamMember = (typeof dummyTeam)[0]
export type Event = (typeof dummyEvents)[0]
export type ScheduleConfig = (typeof officeScheduleConfig)[0]
export type ScheduleOverride = (typeof scheduleOverrides)[0]
export type Holiday = (typeof holidays)[0]
