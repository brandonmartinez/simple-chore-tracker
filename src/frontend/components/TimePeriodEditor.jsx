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
			/>
		</div>
	);
}

export default TimePeriodEditor;
