'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CalendarContextType {
	view: 'month' | 'week'
	setView: (view: 'month' | 'week') => void
	selectedDate: Date
	setSelectedDate: (date: Date) => void
	selectedMembers: number[]
	setSelectedMembers: (members: number[]) => void
	selectedTeams: string[]
	setSelectedTeams: (teams: string[]) => void
	toggleMemberFilter: (memberId: number) => void
	toggleTeamFilter: (teamId: string) => void
	clearFilters: () => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(
	undefined
)

export const useCalendar = () => {
	const context = useContext(CalendarContext)
	if (!context)
		throw new Error('useCalendar must be used within CalendarProvider')
	return context
}

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
	const [view, setView] = useState<'month' | 'week'>('month')
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedMembers, setSelectedMembers] = useState<number[]>([])
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])

	const toggleMemberFilter = (memberId: number) => {
		setSelectedMembers((prev) =>
			prev.includes(memberId)
				? prev.filter((id) => id !== memberId)
				: [...prev, memberId]
		)
	}

	const toggleTeamFilter = (teamId: string) => {
		setSelectedTeams((prev) =>
			prev.includes(teamId)
				? prev.filter((id) => id !== teamId)
				: [...prev, teamId]
		)
	}

	const clearFilters = () => {
		setSelectedMembers([])
		setSelectedTeams([])
	}

	return (
		<CalendarContext.Provider
			value={{
				view,
				setView,
				selectedDate,
				setSelectedDate,
				selectedMembers,
				setSelectedMembers,
				selectedTeams,
				setSelectedTeams,
				toggleMemberFilter,
				toggleTeamFilter,
				clearFilters,
			}}
		>
			{children}
		</CalendarContext.Provider>
	)
}
