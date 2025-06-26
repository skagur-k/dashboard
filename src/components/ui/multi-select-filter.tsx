'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
	id: number | string
	name: string
	avatar?: string
	color?: string
	type?: 'member' | 'team'
}

interface FilterGroup {
	label: string
	options: FilterOption[]
}

interface MultiSelectFilterProps {
	options?: FilterOption[]
	groups?: FilterGroup[]
	selectedValues: (number | string)[]
	onSelectionChange: (values: (number | string)[]) => void
	placeholder?: string
	className?: string
}

export const MultiSelectFilter = ({
	options = [],
	groups = [],
	selectedValues,
	onSelectionChange,
	placeholder = 'Filter',
	className,
}: MultiSelectFilterProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const toggleOption = (optionId: number | string) => {
		const newSelection = selectedValues.includes(optionId)
			? selectedValues.filter((id) => id !== optionId)
			: [...selectedValues, optionId]

		onSelectionChange(newSelection)
		// Don't close dropdown - stays open for multiple selections
	}

	const clearAll = () => {
		onSelectionChange([])
	}

	return (
		<div className={cn('relative', className)} ref={dropdownRef}>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="min-w-[120px] justify-between"
			>
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4" />
					<span>{placeholder}</span>
				</div>
				{selectedValues.length > 0 && (
					<span className="ml-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
						{selectedValues.length}
					</span>
				)}
			</Button>

			{isOpen && (
				<div className="absolute top-full mt-1 right-0 z-50 w-64 bg-popover border border-border rounded-md shadow-lg">
					<div className="p-3">
						<div className="flex items-center justify-between mb-3">
							<h4 className="text-sm font-medium">Filter Options</h4>
							{selectedValues.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearAll}
									className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
								>
									Clear All
								</Button>
							)}
						</div>

						<div className="space-y-1">
							{/* Render groups if provided */}
							{groups.length > 0
								? groups.map((group, groupIndex) => (
										<div key={groupIndex}>
											<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
												{group.label}
											</div>
											{group.options.map((option) => {
												const isSelected = selectedValues.includes(option.id)
												return (
													<div
														key={option.id}
														onClick={() => toggleOption(option.id)}
														className={cn(
															'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors',
															'hover:bg-accent hover:text-accent-foreground',
															isSelected && 'bg-accent/50'
														)}
													>
														<div className="flex items-center gap-2 flex-1">
															{option.avatar && (
																<Avatar className="h-6 w-6 flex-shrink-0">
																	<AvatarImage
																		src={option.avatar}
																		alt={option.name}
																	/>
																	<AvatarFallback className="text-xs">
																		{option.name[0]}
																	</AvatarFallback>
																</Avatar>
															)}
															{option.type === 'team' && !option.avatar && (
																<div
																	className={cn(
																		'h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
																		option.color
																	)}
																>
																	{option.name
																		.split(' ')
																		.map((w) => w[0])
																		.join('')}
																</div>
															)}
															<span className="text-sm">{option.name}</span>
														</div>
														{isSelected && (
															<Check className="h-4 w-4 text-primary flex-shrink-0" />
														)}
													</div>
												)
											})}
											{groupIndex < groups.length - 1 && (
												<div className="border-t border-border my-2" />
											)}
										</div>
								  ))
								: /* Fallback to regular options */
								  options.map((option) => {
										const isSelected = selectedValues.includes(option.id)
										return (
											<div
												key={option.id}
												onClick={() => toggleOption(option.id)}
												className={cn(
													'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors',
													'hover:bg-accent hover:text-accent-foreground',
													isSelected && 'bg-accent/50'
												)}
											>
												<div className="flex items-center gap-2 flex-1">
													{option.avatar && (
														<Avatar className="h-6 w-6 flex-shrink-0">
															<AvatarImage
																src={option.avatar}
																alt={option.name}
															/>
															<AvatarFallback className="text-xs">
																{option.name[0]}
															</AvatarFallback>
														</Avatar>
													)}
													<span className="text-sm">{option.name}</span>
												</div>
												{isSelected && (
													<Check className="h-4 w-4 text-primary flex-shrink-0" />
												)}
											</div>
										)
								  })}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
