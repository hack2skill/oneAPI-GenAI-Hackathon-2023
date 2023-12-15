import React from "react";

export function Layout({ children, location, history }) {
	return (
		<>
			<div className="flex h-[100vh] w-full bg-gray-100">
				<div className="h-[100vh] w-full flex flex-col bg-primary-background min-h-screen w-full rounded md:pb-5">
					<div className="px-4 mt-4 w-full mx-auto flex flex-col h-full overflow-y-scroll overflow-x-hidden">
						{children}
					</div>
				</div>
			</div>
		</>
	);
}
