import React from "react";

function ChoreGrid({ people, groupedChores, sortedCategories }) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${people.length + 1}, 1fr)`,
				gap: "10px",
			}}
		>
			<div></div>
			{people.map((person) => (
				<div key={person.id} style={{ fontWeight: "bold" }}>
					{person.name}
				</div>
			))}
			{sortedCategories.map((category) => (
				<React.Fragment key={category}>
					<h3 style={{ gridColumn: `span ${people.length + 1}` }}>
						{category}
					</h3>
					{groupedChores[category]
						.sort((a, b) => a.title.localeCompare(b.title))
						.map((chore) => (
							<React.Fragment key={chore.id}>
								<div style={{ fontWeight: "bold" }}>{chore.title}</div>
								{people.map((person) => {
									const isAssigned =
										chore.assignedTo && chore.assignedTo.includes(person.id);
									return (
										<div
											key={person.id}
											style={{
												border: "1px solid #ccc",
												padding: "5px",
												textAlign: "center",
											}}
										>
											{isAssigned ? "X" : ""}
										</div>
									);
								})}
							</React.Fragment>
						))}
				</React.Fragment>
			))}
		</div>
	);
}

export default ChoreGrid;
