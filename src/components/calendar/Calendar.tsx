'use client'

import { Button } from '@/components/ui/button'
import { useCalendar } from './CalendarContext'
import { CalendarMonthView } from './CalendarMonthView'
import { CalendarWeekView } from './CalendarWeekView'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MultiSelectFilter } from '@/components/ui/multi-select-filter'
import { dummyTeam, teams } from './calendarData'

export const Calendar = () => {
	const {
		view,
		setView,
		selectedDate,
		setSelectedDate,
		selectedMembers,
		setSelectedMembers,
		selectedTeams,
		setSelectedTeams,
	} = useCalendar()

	const changeDate = (days: number) => {
		const updated = new Date(selectedDate)
		updated.setDate(updated.getDate() + days)
		setSelectedDate(updated)
	}

	// Transform team and member data for the filter component
	const filterGroups = [
		{
			label: 'Teams',
			options: Object.values(teams).map((team) => ({
				id: team.id,
				name: team.name,
				color: team.headerColor,
				type: 'team' as const,
			})),
		},
		{
			label: 'Members',
			options: dummyTeam.map((member) => ({
				id: member.id,
				name: member.name,
				avatar: member.avatar,
				color: member.color,
				type: 'member' as const,
			})),
		},
	]

	// Combine selected teams and members for the filter
	const allSelectedValues = [...selectedTeams, ...selectedMembers]

	const handleFilterChange = (values: (number | string)[]) => {
		const teamValues = values.filter(
			(val) => typeof val === 'string'
		) as string[]
		const memberValues = values.filter(
			(val) => typeof val === 'number'
		) as number[]

		setSelectedTeams(teamValues)
		setSelectedMembers(memberValues)
	}

	return (
		<Card className="bg-transparent gap-0 py-0 pt-6">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 flex-1">
						<Button
							variant="outline"
							onClick={() => changeDate(view === 'month' ? -30 : -7)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							onClick={() => setSelectedDate(new Date())}
						>
							<CalendarDays className="h-4 w-4" /> Today
						</Button>
						<Button
							variant="outline"
							onClick={() => changeDate(view === 'month' ? 30 : 7)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex-1 text-center">
						<h2 className="text-2xl font-semibold">
							{selectedDate.toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric',
							})}
						</h2>
					</div>
					<div className="flex-1 flex justify-end items-center gap-3">
						{/* Team Legend */}
						<div className="flex items-center gap-2 text-xs">
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
								<span className="text-muted-foreground">DO</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 rounded bg-purple-100 border border-purple-200"></div>
								<span className="text-muted-foreground">DA</span>
							</div>
						</div>

						<MultiSelectFilter
							groups={filterGroups}
							selectedValues={allSelectedValues}
							onSelectionChange={handleFilterChange}
							placeholder="Filter"
						/>
						<Tabs
							value={view}
							onValueChange={(value) => setView(value as 'month' | 'week')}
							className="w-auto flex-shrink-0"
						>
							<TabsList>
								<TabsTrigger value="month">Month</TabsTrigger>
								<TabsTrigger value="week">Week</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className="p-0">
				<Tabs
					value={view}
					onValueChange={(value) => setView(value as 'month' | 'week')}
				>
					<TabsContent value="month">
						<CalendarMonthView />
					</TabsContent>
					<TabsContent value="week">
						<CalendarWeekView />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
