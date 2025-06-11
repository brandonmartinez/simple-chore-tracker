import logger from "./logger.js";

export async function fetchItems(resourceName) {
	logger.info(`Fetching ${resourceName} from API`);
	const response = await fetch(`/api/${resourceName}`);
	if (!response.ok) {
		logger.error(`Failed to fetch ${resourceName}`, {
			status: response.status,
		});
		throw new Error(`Failed to fetch ${resourceName}`);
	}
	return response.json();
}

export async function addItems(resourceName, itemName, item) {
	logger.info(`Adding new ${itemName} to API`, { item });
	const response = await fetch(`/api/${resourceName}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(item),
	});
	if (!response.ok) {
		const errorText = await response.text();
		logger.error(`Failed to add ${itemName}`, {
			status: response.status,
			error: errorText,
		});
		throw new Error(`Failed to add ${itemName}`);
	}
	return response.json();
}

export async function updateItem(resourceName, itemName, itemId, updates) {
	logger.info(`Updating ${itemName}`, { itemId, updates });
	const response = await fetch(`/api/${resourceName}/${itemId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updates),
	});
	if (!response.ok) {
		logger.error(`Failed to update ${itemName}`, { status: response.status });
		throw new Error(`Failed to update ${itemName}`);
	}
	return response.json();
}

export async function removeItem(resourceName, itemName, itemId) {
	logger.info(`Removing ${itemName}`, { itemId });
	const response = await fetch(`/api/${resourceName}/${itemId}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		logger.error(`Failed to remove ${itemName}`, { status: response.status });
		throw new Error(`Failed to remove ${itemName}`);
	}
	return response.json();
}
