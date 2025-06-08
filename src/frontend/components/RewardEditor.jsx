import React, { useState } from "react";
import { addReward, markRewardAsDeleted } from "../apiService";

function RewardEditor({ rewards, setRewards, onAddReward, onUpdateReward }) {
	const [newReward, setNewReward] = useState({
		title: "",
		points_cost: 0,
	});
	const [sortConfig, setSortConfig] = useState({
		key: "title",
		direction: "asc",
	});

	const sortedRewards = [...rewards].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleEdit = (id, field, value) => {
		setRewards((prevRewards) =>
			prevRewards.map((reward) =>
				reward.id === id ? { ...reward, [field]: value } : reward
			)
		);
	};

	const handleSave = (id) => {
		const reward = rewards.find((reward) => reward.id === id);
		onUpdateReward(id, reward);
	};

	const handleAdd = async () => {
		try {
			const { id } = await addReward(newReward);
			setRewards((prevRewards) => [...prevRewards, { ...newReward, id }]);
			setNewReward({ title: "", points_cost: 0 });
		} catch (error) {
			console.error("Failed to add reward:", error);
		}
	};

	const handleSort = (key) => {
		setSortConfig((prevConfig) => {
			if (prevConfig.key === key) {
				return {
					key,
					direction: prevConfig.direction === "asc" ? "desc" : "asc",
				};
			}
			return { key, direction: "asc" };
		});
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this reward?")) {
			return;
		}
		try {
			await markRewardAsDeleted(id);
			setRewards((prevRewards) =>
				prevRewards.map((reward) =>
					reward.id === id ? { ...reward, deleted: true } : reward
				)
			);
		} catch (error) {
			console.error("Failed to mark reward as deleted:", error);
		}
	};

	return (
		<div>
			<h2 className="mb-4 text-2xl">Reward Editor</h2>
			<table className="border border-collapse border-gray-300 w-full table-auto">
				<thead>
					<tr className="bg-gray-100">
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("id")}
						>
							ID
						</th>
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("title")}
						>
							Title
						</th>
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("points_cost")}
						>
							Points Cost
						</th>
						<th className="px-4 py-2 border border-gray-300">Actions</th>
					</tr>
				</thead>
				<tbody>
					{sortedRewards.map((reward) => (
						<tr key={String(reward.id)} className="hover:bg-gray-50">
							<td className="px-4 py-2 border border-gray-300">
								{String(reward.id)}
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<input
									type="text"
									value={reward.title || ""}
									onChange={(e) =>
										handleEdit(reward.id, "title", e.target.value)
									}
									className="p-2 border border-gray-300 rounded w-full"
								/>
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<input
									type="number"
									value={reward.points_cost || 0}
									onChange={(e) =>
										handleEdit(reward.id, "points_cost", e.target.value)
									}
									className="p-2 border border-gray-300 rounded w-full"
								/>
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<button
									onClick={() => handleSave(reward.id)}
									className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
								>
									Save
								</button>
								<button
									onClick={() => handleDelete(reward.id)}
									className="bg-red-500 hover:bg-red-600 ml-2 px-4 py-2 rounded text-white"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
					<tr className="hover:bg-gray-50">
						<td className="px-4 py-2 border border-gray-300">New</td>
						<td className="px-4 py-2 border border-gray-300">
							<input
								type="text"
								value={newReward.title || ""}
								onChange={(e) =>
									setNewReward({ ...newReward, title: e.target.value })
								}
								className="p-2 border border-gray-300 rounded w-full"
							/>
						</td>
						<td className="px-4 py-2 border border-gray-300">
							<input
								type="number"
								value={newReward.points_cost || 0}
								onChange={(e) =>
									setNewReward({ ...newReward, points_cost: e.target.value })
								}
								className="p-2 border border-gray-300 rounded w-full"
							/>
						</td>
						<td className="px-4 py-2 border border-gray-300">
							<button
								onClick={handleAdd}
								className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
							>
								Add
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default RewardEditor;
