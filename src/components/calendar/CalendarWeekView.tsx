// components/calendar/CalendarWeekView.tsx
import { useCalendar } from './CalendarContext'
import { startOfWeek, addDays, format, isToday } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getMembersInOffice, isHoliday } from './officeSchedule'

export const CalendarWeekView = () => {
	const { selectedDate, selectedMembers, selectedTeams } = useCalendar()
	const start = startOfWeek(selectedDate)
	const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

	return (
		<div className="p-4">
			<div className="grid grid-cols-7 gap-4">
				{days.map((day, i) => {
					const membersInOffice = getMembersInOffice(
						day,
						selectedMembers,
						selectedTeams
					)
					const holiday = isHoliday(day)

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
							key={i}
							className={cn(
								'border rounded-lg p-3 min-h-[200px] bg-background',
								isToday(day) && 'ring-2 ring-primary',
								holiday && 'bg-red-50 border-red-200'
							)}
						>
							<div
								className={cn(
									'font-medium text-sm mb-3 text-center',
									isToday(day) && 'text-primary font-semibold',
									holiday && 'text-red-600'
								)}
							>
								<div className="flex items-center justify-center gap-1">
									<span>{format(day, 'EEEE')}</span>
									{holiday && <span title={holiday.name}>🎉</span>}
								</div>
								<div className="text-lg">{format(day, 'd')}</div>
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
												'flex items-center gap-1.5 justify-start px-2 py-1 h-auto opacity-70 hover:opacity-100 transition-opacity',
												teamColor
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
										<div className="text-xs text-muted-foreground text-center py-4">
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
