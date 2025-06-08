import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<div className="top-0 md:top-0 z-10 sticky md:sticky shadow-md">
			<h1 className="mb-4 text-6xl">Simple Chore Tracker</h1>
			<nav className="flex space-x-4 mb-4">
				<Link
					to="/chores"
					className="bg-gray-200 hover:bg-blue-500 px-4 py-2 rounded hover:text-white"
				>
					Chore List
				</Link>
				<Link
					to="/chores/editor"
					className="bg-gray-200 hover:bg-blue-500 px-4 py-2 rounded hover:text-white"
				>
					Chore Editor
				</Link>
				<Link
					to="/people"
					className="bg-gray-200 hover:bg-blue-500 px-4 py-2 rounded hover:text-white"
				>
					People
				</Link>
				<Link
					to="/time-periods"
					className="bg-gray-200 hover:bg-blue-500 px-4 py-2 rounded hover:text-white"
				>
					Time Period
				</Link>
			</nav>
		</div>
	);
}
