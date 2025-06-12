import { fetchItems, addItem, updateItem, removeItem } from "./apiHelpers.js";
import logger from "./logger.js";

export async function fetchRewards() {
	return await fetchItems("rewards");
}

export async function addReward(reward) {
	return await addItem("rewards", "reward", reward);
}

export async function updateReward(rewardId, updates) {
	return await updateItem("rewards", "reward", rewardId, updates);
}

export async function removeReward(rewardId) {
	return await removeItem("rewards", "reward", rewardId);
}
