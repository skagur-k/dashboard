import {
	startOfWeek,
	isSameDay,
	getDay,
	addDays,
	isSameWeek,
	isWeekend,
	subDays,
} from 'date-fns'
import {
	dummyTeam,
	officeScheduleConfig,
	scheduleOverrides,
	holidays,
	type TeamMember,
	type Holiday,
} from './calendarData'

/**
 * Get team members who should be in office on a specific date
 * Takes into account regular schedule, overrides, and holidays
 */
export const getMembersInOffice = (
	date: Date,
	selectedMembers: number[] = [],
	selectedTeams: string[] = []
): TeamMember[] => {
	const weekStart = startOfWeek(date, { weekStartsOn: 0 })

	const membersInOffice = officeScheduleConfig
		.map((config) => {
			// Get adjusted schedule for the week
			const adjustedDates = getAdjustedWeeklySchedule(
				config.memberId,
				weekStart
			)

			// Check if this member should be in office on this specific date
			const shouldBeInOffice = adjustedDates.some((adjustedDate) =>
				isSameDay(adjustedDate, date)
			)

			if (shouldBeInOffice) {
				return dummyTeam.find((member) => member.id === config.memberId)
			}

			return null
		})
		.filter(Boolean) as TeamMember[]

	// Apply team filter if any teams are selected
	let filteredMembers = membersInOffice
	if (selectedTeams.length > 0) {
		filteredMembers = filteredMembers.filter((member) =>
			selectedTeams.includes(member.team)
		)
	}

	// Apply member filter if any members are selected
	if (selectedMembers.length > 0) {
		filteredMembers = filteredMembers.filter((member) =>
			selectedMembers.includes(member.id)
		)
	}

	return filteredMembers
}

/**
 * Get regular office schedule for a member
 */
export const getMemberRegularSchedule = (memberId: number): number[] => {
	const config = officeScheduleConfig.find((c) => c.memberId === memberId)
	return config ? config.regularDays : []
}

/**
 * Get override schedule for a member for a specific week
 */
export const getMemberOverrideSchedule = (
	memberId: number,
	date: Date
): number[] | null => {
	const override = scheduleOverrides.find(
		(override) =>
			override.memberId === memberId &&
			isSameWeek(override.weekStartDate, date, { weekStartsOn: 0 })
	)
	return override ? override.newDays : null
}

/**
 * Get effective schedule for a member (including overrides)
 */
export const getMemberEffectiveSchedule = (
	memberId: number,
	date: Date
): number[] => {
	const override = getMemberOverrideSchedule(memberId, date)
	return override !== null ? override : getMemberRegularSchedule(memberId)
}

/**
 * Check if a member has an override for a specific week
 */
export const hasScheduleOverride = (memberId: number, date: Date): boolean => {
	return getMemberOverrideSchedule(memberId, date) !== null
}

/**
 * Get day names for display
 */
export const getDayNames = (): string[] => {
	return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

/**
 * Get short day names for display
 */
export const getShortDayNames = (): string[] => {
	return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

/**
 * Check if a given date is a holiday
 */
export const isHoliday = (date: Date): Holiday | null => {
	const holiday = holidays.find((holiday) => isSameDay(holiday.date, date))
	return holiday || null
}

/**
 * Check if a given date is a working day (not weekend and not holiday)
 */
export const isWorkingDay = (date: Date): boolean => {
	return !isWeekend(date) && !isHoliday(date)
}

/**
 * Find the nearest working day to a given date
 * Prioritizes the day before, then the day after
 */
export const findNearestWorkingDay = (date: Date): Date => {
	if (isWorkingDay(date)) {
		return date
	}

	// Try previous days first (up to 3 days back)
	for (let i = 1; i <= 3; i++) {
		const prevDay = subDays(date, i)
		if (isWorkingDay(prevDay)) {
			return prevDay
		}
	}

	// Try next days (up to 3 days forward)
	for (let i = 1; i <= 3; i++) {
		const nextDay = addDays(date, i)
		if (isWorkingDay(nextDay)) {
			return nextDay
		}
	}

	// Fallback to original date if no working day found
	return date
}

/**
 * Get adjusted office schedule for a week, accounting for holidays
 * If there are 2+ holidays in a week, member only comes in once
 */
export const getAdjustedWeeklySchedule = (
	memberId: number,
	weekStartDate: Date
): Date[] => {
	const memberConfig = officeScheduleConfig.find(
		(config) => config.memberId === memberId
	)
	if (!memberConfig) return []

	// Check for overrides first
	const override = scheduleOverrides.find(
		(override) =>
			override.memberId === memberId &&
			isSameWeek(override.weekStartDate, weekStartDate, { weekStartsOn: 0 })
	)

	const scheduledDays = override ? override.newDays : memberConfig.regularDays

	// Convert day numbers to actual dates for this week
	const scheduledDates = scheduledDays.map((dayOfWeek) => {
		const date = addDays(weekStartDate, dayOfWeek)
		return date
	})

	// Count holidays in the week that affect scheduled days
	const holidaysInScheduledDays = scheduledDates.filter((date) =>
		isHoliday(date)
	)

	// If 2+ scheduled days are holidays, member only comes in once this week
	if (holidaysInScheduledDays.length >= 2) {
		// Find first non-holiday scheduled day, or adjust the first holiday
		const nonHolidayDays = scheduledDates.filter((date) => !isHoliday(date))
		if (nonHolidayDays.length > 0) {
			return [nonHolidayDays[0]] // Just the first available day
		} else {
			// All scheduled days are holidays, find nearest working day for the first one
			const adjustedDate = findNearestWorkingDay(scheduledDates[0])
			return [adjustedDate]
		}
	}

	// Adjust individual holiday dates to nearest working days
	const adjustedDates = scheduledDates.map((date) => {
		if (isHoliday(date)) {
			return findNearestWorkingDay(date)
		}
		return date
	})

	// Remove duplicates that might occur from adjustments
	const uniqueDates = adjustedDates.filter(
		(date, index, arr) => arr.findIndex((d) => isSameDay(d, date)) === index
	)

	return uniqueDates
}
