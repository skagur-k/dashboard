import { Calendar } from '@/components/calendar/Calendar'
import AppAreaChart from '@/components/charts/AppAreaChart'
import AppBarChart from '@/components/charts/AppBarChart'

export default function Home() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
			<div className="p-4 rounded-lg lg:col-span-2 2xl:col-span-4">
				<Calendar />
			</div>
			<div className="p-4 rounded-lg lg:col-span-2 2xl:col-span-1">
				<AppBarChart />
			</div>
		</div>
	)
}
