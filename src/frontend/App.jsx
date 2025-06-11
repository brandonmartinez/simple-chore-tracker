import React, { useEffect, useState } from "react";
import logger from "./services/logger";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import ChoreGrid from "./components/ChoreGrid";
import ChoreEditor from "./components/ChoreEditor";
import Navbar from "./components/Navbar";
import RewardEditor from "./components/RewardEditor";
import TimePeriodEditor from "./components/TimePeriodEditor";
import {
	fetchChores,
	fetchChoreAssignments,
} from "./services/choresApiService";
import { fetchPeople } from "./services/peopleApiService";
import { fetchRewards } from "./services/rewardsApiService";
import {
	fetchCurrentTimePeriod,
	fetchAvailableTimePeriods,
} from "./services/timePeriodsApiService";

export default function App() {
	const [chores, setChores] = useState([]);
	const [people, setPeople] = useState([]);
	const [timePeriod, setTimePeriod] = useState(null);
	const [timePeriods, setTimePeriods] = useState([]);
	const [rewards, setRewards] = useState([]);

	useEffect(() => {
		logger.info("Fetching initial data...");
		fetchChores().then((chores) => {
			logger.info("Fetched chores:", chores);
			setChores(chores);
		});
		fetchPeople().then((people) => {
			logger.info("Fetched people:", people);
			setPeople(people);
		});
		fetchAvailableTimePeriods().then((weeks) => {
			logger.info("Fetched available weeks:", weeks);
			setTimePeriods(weeks);
		});
		fetchCurrentTimePeriod().then((period) => {
			logger.info("Fetched current time period:", period);
			setTimePeriod(period);
		});
		fetchRewards().then((fetchedRewards) => {
			logger.info("Fetched rewards:", fetchedRewards);
			setRewards(fetchedRewards);
		});
	}, []);

	useEffect(() => {
		if (!timePeriod) {
			logger.warn("No time period selected.");
			return;
		}
		logger.info("Time period selected:", timePeriod);

		fetchChoreAssignments({ timePeriodId: timePeriod.id }).then(
			(assignments) => {
				logger.info("Fetched assignments for time period:", assignments);
				setChores((prevChores) => {
					// Clear all assignments first
					const clearedChores = prevChores.map((chore) => ({
						...chore,
						assignedTo: [],
					}));
					logger.info("Cleared chores state:", clearedChores);

					if (assignments.length === 0) {
						logger.warn("No assignments found for the current time period.");
						return clearedChores;
					}

					// Reassign based on fetched assignments
					const updatedChores = clearedChores.map((chore) => {
						const assignment = assignments.find(
							(a) =>
								a.chore_id === chore.id && a.time_period_id === timePeriod.id
						);
						return assignment
							? {
									...chore,
									assignedTo: assignment.person_id
										? [assignment.person_id]
										: [],
							  }
							: chore;
					});
					logger.info("Updated chores state:", updatedChores);
					return updatedChores;
				});
			}
		);
	}, [timePeriod]);

	return (
		<Router>
			<Navbar />
			<div className="p-4">
				<Routes>
					<Route path="/" element={<Navigate to="/chores" replace />} />
					<Route
						path="/chores"
						element={
							<ChoreGrid
								people={people}
								chores={chores}
								setChores={setChores}
								timePeriod={timePeriod}
								setTimePeriod={setTimePeriod}
								timePeriods={timePeriods}
							/>
						}
					/>
					<Route
						path="/chores/editor"
						element={<ChoreEditor chores={chores} setChores={setChores} />}
					/>
					<Route path="/people" element={<div>People Component</div>} />
					<Route
						path="/time-periods/editor"
						element={
							<TimePeriodEditor
								timePeriods={timePeriods}
								setTimePeriods={setTimePeriods}
							/>
						}
					/>
					<Route
						path="/rewards/editor"
						element={<RewardEditor rewards={rewards} setRewards={setRewards} />}
					/>
				</Routes>
			</div>
		</Router>
	);
}
