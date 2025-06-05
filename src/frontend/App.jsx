import React, { useEffect, useState } from "react";
import ChoreGrid from "./ChoreGrid";

export default function App() {
	const [chores, setChores] = useState([]);
	const [people, setPeople] = useState([]);
	const [timePeriod, setTimePeriod] = useState(null);

	useEffect(() => {
		// Fetch chores
		fetch("/api/chores")
			.then((res) => res.json())
			.then(setChores);

		// Fetch people
		fetch("/api/people")
			.then((res) => res.json())
			.then(setPeople);

		// Fetch current time period
		fetch("/api/current-time-period")
			.then((res) => res.json())
			.then(setTimePeriod);
	}, []);

	function formatDate(dateStr) {
		// Parse as UTC if dateStr is in 'YYYY-MM-DD' format to avoid timezone issues
		let date;
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
			const [year, month, day] = dateStr.split("-");
			date = new Date(Date.UTC(year, month - 1, day));
		} else {
			date = new Date(dateStr);
		}
		const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
		const dd = String(date.getUTCDate()).padStart(2, "0");
		const yyyy = date.getUTCFullYear();
		return `${mm}/${dd}/${yyyy}`;
	}

	const groupedChores = chores.reduce((acc, chore) => {
		const category = chore.category || "Uncategorized";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(chore);
		return acc;
	}, {});

	const sortedCategories = Object.keys(groupedChores).sort();

	return (
		<div>
			<h1>Simple Chore Tracker</h1>
			{timePeriod && <h2>Week of {formatDate(timePeriod.start_date)}</h2>}
			<ChoreGrid
				people={people}
				groupedChores={groupedChores}
				sortedCategories={sortedCategories}
			/>
		</div>
	);
}
