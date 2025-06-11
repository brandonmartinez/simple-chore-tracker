import React from "react";
import {
	addTimePeriod,
	removeTimePeriod,
	updateTimePeriod,
} from "../services/timePeriodsApiService";
import EditorGrid from "./EditorGrid";

function TimePeriodEditor({ timePeriods, setTimePeriods }) {
	const columns = [
		{
			key: "start_date",
			label: "Start Date",
			type: "date",
		},
		{
			key: "end_date",
			label: "End Date",
			type: "date",
		},
	];

	const newTemplate = () => {
		if (timePeriods.length === 0) {
			return {
				start_date: new Date().toISOString().split("T")[0],
				end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split("T")[0],
			};
		}

		const latestEndDate = new Date(
			timePeriods.reduce((latest, period) => {
				const endDate = new Date(period.end_date);
				return endDate > latest ? endDate : latest;
			}, new Date(0))
		);

		const newStartDate = new Date(
			latestEndDate.getTime() + 24 * 60 * 60 * 1000
		);
		const newEndDate = new Date(
			newStartDate.getTime() + 6 * 24 * 60 * 60 * 1000
		);

		return {
			start_date: newStartDate.toISOString().split("T")[0],
			end_date: newEndDate.toISOString().split("T")[0],
		};
	};

	return (
		<div>
			<h2 className="mb-4 text-2xl">Time Period Editor</h2>
			<EditorGrid
				config={{
					singular: "time period",
					plural: "time periods",
					defaultSort: "start_date",
				}}
				columns={columns}
				items={timePeriods}
				setItems={setTimePeriods}
				onAdd={addTimePeriod}
				onUpdate={updateTimePeriod}
				onDelete={removeTimePeriod}
				newTemplate={newTemplate}
			/>
		</div>
	);
}

export default TimePeriodEditor;
