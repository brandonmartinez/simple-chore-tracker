import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<div className="top-0 z-10 sticky bg-slate-200 dark:bg-slate-700 m-0 mb-5 p-4 w-full">
			<div className="">
				<h1 className="mb-4 text-6xl text-center text-slate-800 dark:text-slate-100">
					Simple Chore Tracker
				</h1>
				<nav className="flex justify-center space-x-4 mb-4">
					<Link
						to="/chores"
						className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 dark:text-slate-100"
					>
						Chores
					</Link>
					<Link
						to="/people"
						className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 dark:text-slate-100"
					>
						People
					</Link>
					<Link
						to="/chores/editor"
						className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 dark:text-slate-100"
					>
						Chore Editor
					</Link>
					<Link
						to="/rewards/editor"
						className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 dark:text-slate-100"
					>
						Reward Editor
					</Link>
					<Link
						to="/time-periods/editor"
						className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 dark:text-slate-100"
					>
						Time Period Editor
					</Link>
				</nav>
			</div>
		</div>
	);
}
