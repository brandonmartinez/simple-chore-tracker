import { fetchItems, addItem, updateItem, removeItem } from "./apiHelpers.js";
import logger from "./logger.js";

export async function fetchPeople() {
	return await fetchItems("people");
}

export async function addPerson(person) {
	return await addItem("people", "person", person);
}

export async function updatePerson(personId, updates) {
	return await updateItem("people", "person", personId, updates);
}

export async function removePerson(personId) {
	return await removeItem("people", "person", personId);
}
