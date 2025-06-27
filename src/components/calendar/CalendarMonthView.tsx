'use client'

// components/calendar/CalendarMonthView.tsx
import { useCalendar } from './CalendarContext'
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	isToday,
	isSameDay,
	isWithinInterval,
	startOfDay,
	endOfDay,
} from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { dummyEvents } from './calendarData'
import { getMembersInOffice, isHoliday } from './officeSchedule'

export const CalendarMonthView = () => {
	const { selectedDate, selectedMembers, selectedTeams } = useCalendar()

	const monthStart = startOfMonth(selectedDate)
	const monthEnd = endOfMonth(selectedDate)
	const startDate = startOfWeek(monthStart)
	const endDate = endOfWeek(monthEnd)

	const rows = []
	let days = []
	let day = startDate

	while (day <= endDate) {
		for (let i = 0; i < 7; i++) {
			days.push(day)
			day = addDays(day, 1)
		}
		rows.push(days)
		days = []
	}

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	// Helper function to get events for a specific date
	const getEventsForDate = (date: Date) => {
		return dummyEvents.filter((event) =>
			isWithinInterval(date, {
				start: startOfDay(event.startDate),
				end: endOfDay(event.endDate),
			})
		)
	}

	// Helper function to determine event position in multi-day span
	const getEventPosition = (event: any, date: Date) => {
		const isStart = isSameDay(date, event.startDate)
		const isEnd = isSameDay(date, event.endDate)
		const isSingle = isSameDay(event.startDate, event.endDate)

		if (isSingle) return 'single'
		if (isStart) return 'start'
		if (isEnd) return 'end'
		return 'middle'
	}

	return (
		<div className="">
			{/* Weekday headers */}
			<div className="grid grid-cols-7">
				{weekdays.map((day) => (
					<div
						key={day}
						className="p-2 text-center text-sm font-semibold border-b border-border last:border-r-0"
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7">
				{rows.flat().map((date, idx) => {
					const events = getEventsForDate(date)
					const membersInOffice = getMembersInOffice(
						date,
						selectedMembers,
						selectedTeams
					)
					const holiday = isHoliday(date)

					// Group members by team
					const membersByTeam = membersInOffice.reduce((acc, member) => {
						if (!acc[member.team]) {
							acc[member.team] = []
						}
						acc[member.team].push(member)
						return acc
					}, {} as Record<string, typeof membersInOffice>)

					return (
						<div
							key={idx}
							className={cn(
								'border-r border-b border-border p-2 min-h-[120px] last:border-r-0',
								!isSameMonth(date, monthStart) ? 'text-accent' : '',
								isToday(date) ? 'text-primary' : '',
								holiday && 'bg-accent/40'
							)}
						>
							<div className="flex items-center justify-between mb-1">
								<div
									className={cn(
										'text-sm font-semibold',
										holiday && 'text-red-600'
									)}
								>
									{format(date, 'd')}
								</div>
								{holiday && (
									<div
										className="text-xs text-red-600 font-medium"
										title={holiday.name}
									>
										🎉
									</div>
								)}
							</div>

							{/* Events */}
							<div className="space-y-1 mb-2">
								{events.map((event) => {
									const position = getEventPosition(event, date)
									return (
										<div
											key={`${event.id}-${date.getTime()}`}
											className={cn(
												'text-xs text-white px-2 py-1 text-center font-medium',
												event.color,
												position === 'start' && 'rounded-l-md',
												position === 'end' && 'rounded-r-md',
												position === 'single' && 'rounded-md',
												!isSameMonth(date, monthStart) && 'opacity-50'
											)}
											title={`${event.title} (${format(
												event.startDate,
												'MMM d'
											)} - ${format(event.endDate, 'MMM d')})`}
										>
											{position === 'start' || position === 'single'
												? event.title
												: ''}
										</div>
									)
								})}
							</div>

							{/* Team Members in Office */}
							<div className="flex flex-wrap gap-1">
								{membersInOffice.map((member) => {
									// Use team-based color coding
									const teamColor =
										member.team === 'DO'
											? 'bg-blue-100 text-blue-800 border-blue-200'
											: 'bg-purple-100 text-purple-800 border-purple-200'

									return (
										<Badge
											key={member.id}
											className={cn(
												'flex items-center gap-1.5 justify-start px-2 py-1 h-auto hover:opacity-100 transition-opacity',
												teamColor,
												!isSameMonth(date, monthStart) && 'opacity-30'
											)}
										>
											<span className="truncate text-xs font-medium">
												{member.name}
											</span>
										</Badge>
									)
								})}
								{membersInOffice.length === 0 &&
									selectedMembers.length === 0 &&
									selectedTeams.length === 0 && (
										<div className="text-xs text-muted-foreground">
											No one in office
										</div>
									)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
