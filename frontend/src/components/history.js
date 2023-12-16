import React, { useState, useEffect } from "react";

import { useModal } from "../contexts/ModalContext"; // Adjust the path

const ServiceCard = ({ item, tokens }) => {
	const {
		id,
		village,
		service_name,
		search_number,
		request_date_time,
		request_status,
		service_requests_history,
	} = item;
	const accessToken = tokens.access;
	const authHeader = "Bearer " + accessToken;
	const options = [
		"खसरा नंबर",
		"वार्ड नंबर",
		"घर नं.",
		"प्लॉट नं.",
		"शिट नं.",
		"सिटी सर्वे नं.",
		"स.नं.",
		"प.ह.नं.",
		"प्लॉट ची आराजी",
	];

	const initialParams = options.map((option) => ({
		inputValue: "",
		selectedOption: option,
	}));
	const [params, setParams] = useState(initialParams);

	const { openModal, closeModal } = useModal();

	const contentComponent = () => {
		return (
			<div>
				{/* Your modal content here */}

				<div className="z-10000 bg-white popup fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-5 rounded-lg relative">
						{/* Close Button */}
						<button
							onClick={() => closeModal(false)}
							className="text-gray-500 hover:text-gray-700 cursor-pointer absolute top-2 right-2"
						>
							X
						</button>

						{/* Multiple Dropdown and Input Pairs */}
						{params.map((param, index) => (
							<div key={index} className="flex items-center mt-4 space-x-4">
								<span className="flex-1">{param.selectedOption}</span>

								<input
									id={index}
									type="text"
									// value={param.inputValue}
									onChange={(e) => {
										const newParams = [...params];
										newParams[index].inputValue = e.target.value;
										setParams(newParams);
									}}
									className="flex-1 p-2 border border-gray-300 rounded bg-gray-200"
									placeholder="Enter a value"
								/>
							</div>
						))}

						{/* Submit Button */}
						<button
							onClick={() => {
								const filteredParams = params.filter(
									(p) => p.inputValue.trim() !== ""
								);
								const payload = {
									srId: id,
									params: filteredParams.map((p) => [
										p.inputValue,
										p.selectedOption,
									]),
								};
								handleSubmit(payload);
							}}
							className="bg-green-700 text-white p-2 mt-4 rounded-full w-full"
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		);
	};
	const handleOpenModal = () => {
		openModal(() => contentComponent());
	};

	const handleDownload = (url) => {
		// Implement the logic to handle the download, for example, open the URL in a new tab
		window.open(url, "_blank");
	}; // State for pop-up visibility, dropdown selection, and input value

	let apiUrl;
	if (process.env.NODE_ENV === "development") {
		apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
	} else {
		apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
	}

	// Handle the extract report button click
	const handleExtractReportClick = () => {
		closeModal(true);
	};
	// Handle the submit button click inside the pop-up
	const handleSubmit = async (payload) => {
		try {
			const response = await fetch(apiUrl + "service/check_relevance", {
				method: "POST",
				headers: {
					accept: "application/json",
					Authorization: authHeader,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			console.log("Check relevance response:", data);
			closeModal(false); // Close the pop-up
		} catch (error) {
			console.error("Error checking relevance:", error);
		}
	};

	const handleExtractReport = async (id) => {
		try {
			const response = await fetch(apiUrl + "service/extract_report", {
				method: "POST",
				headers: {
					accept: "application/json",
					Authorization: authHeader,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ srId: id }),
			});
			const data = await response.json();
			console.log("Extract report response:", data);
			// Handle any post-response logic here
		} catch (error) {
			console.error("Error extracting report:", error);
		}
	};
	const downloadIconUrl = "/10255664.png"; // Assuming you have a download.svg in the public folder
	const reportIconUrl = "/extract.png";

	return (
		<div
			className="card bg-white flex flex-col justify-between p-5 m-2 border border-gray-300 rounded-2xl transition-shadow duration-200 relative"
			style={{ minHeight: "100px" }}
		>
			{/* Emphasized Year Range */}

			<div>
				<h5 className="card-title text-m font-bold text-gray-900 mb-2 top-5 left-5">
					{item.village.village_text_en}
				</h5>
				{/* Request Status at the top right */}
				<span
					className={`absolute bottom-5 right-5 rounded-full px-3 py-1 text-sm ${
						request_status === "Delivered"
							? "bg-green-500 text-white"
							: "bg-yellow-500 text-black"
					}`}
				>
					{request_status}
				</span>
			</div>

			<div className="content mt-4">
				<p className="card-description text-base text-gray-700 mb-4">
					Search number: {search_number}
				</p>
				{request_status === "Delivered" ? (
					<div className="flex items-center space-x-4">
						<button
							onClick={() => {
								handleDownload(item.service_requests_history[0].delivery_url);
							}}
							className="text-gray-400 hover:text-gray-600"
						>
							<img src={downloadIconUrl} alt="Download" className="w-6 h-6" />
						</button>
						{item.service_requests_history[0].is_extracted_delivery === true ? (
							<button
								onClick={() => handleOpenModal()}
								className="text-blue-400 hover:text-blue-600"
							>
								<img
									src={reportIconUrl}
									alt="Extract Report"
									className="w-6 h-6"
								/>
							</button>
						) : (
							// Placeholder div
							<div className="w-6 h-6"></div>
						)}
					</div>
				) : (
					// Placeholder div for both icons
					<div className="flex items-center space-x-4">
						<div className="w-6 h-6"></div>
						<div className="w-6 h-6"></div>
					</div>
				)}
			</div>
		</div>
	);
};

function formatDate(dateString) {
	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const [year, month, day] = dateString.split("-").map(Number);
	const dateObj = new Date(year, month - 1, day);

	const dayOfWeek = daysOfWeek[dateObj.getDay()];
	const monthName = months[dateObj.getMonth()];
	const dayOfMonth = dateObj.getDate();
	const suffix = getNumberSuffix(dayOfMonth);

	return `${dayOfWeek}, ${dayOfMonth}${suffix} ${monthName}`;
}

function getNumberSuffix(number) {
	if (number >= 11 && number <= 13) {
		return "th";
	}
	const lastDigit = number % 10;
	switch (lastDigit) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

// define a function component to fetch data from the API
const RightSide = ({ tokens, userId, showHistory, setShowHistory }) => {
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1); // Add state for page number
	const [totalpages, setTotalPages] = useState(1); // Add state for page number
	const [isLoading, setIsLoading] = useState(false);
	const accessToken = tokens.access;
	const [noNewItems, setNoNewItems] = useState(false);

	const authHeader = "Bearer " + accessToken;
	useEffect(() => {
		setIsLoading(true);
		let apiUrl;
		if (process.env.NODE_ENV === "development") {
			apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
		} else {
			apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
		}
		fetch(apiUrl + "service/history", {
			// ... (same as before, but use 'page' state for pagination)
			method: "POST",
			headers: {
				accept: "application/json",
				Authorization: authHeader,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: userId,
				page: page,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				// Apply the filter here
				const filteredData = json.result.data.filter(
					(item) => item.service_name !== "Esearch"
				);

				const newItems = filteredData.filter(
					(newItem) => !data.some((item) => item.id === newItem.id)
				);
				if (newItems.length === 0) {
					setNoNewItems(true);
				} else {
					setData((prevData) => [...prevData, ...newItems]);
				}
				setIsLoading(false);
			});
	}, [page]); // Watch for changes in 'page'

	const loadMore = () => {
		setPage(page + 1);
	};
	const groupedData = data.reduce((groups, item) => {
		const name = item.name || "Unknown";
		const villageName = item.village.village || "Unknown";

		if (!groups[name]) {
			groups[name] = {};
		}

		if (!groups[name][villageName]) {
			groups[name][villageName] = [];
		}

		groups[name][villageName].push(item);
		return groups;
	}, {});

	const toggleGroup = (name) => {
		if (activeGroup === name) {
			setActiveGroup(""); // collapse if the same group is clicked
		} else {
			setActiveGroup(name); // expand the clicked group
		}
	};
	const [activeGroup, setActiveGroup] = useState("Unknown");

	const filteredData = data.filter((item) => item.service_name === "Esearch");

	return (
		<div className="right-side p-4">
			{!showHistory ? null : isLoading ? (
				<p className="text-gray-600">Loading...</p>
			) : (
				<div>
					<h3 className="font-bold text-2xl pt-4">Downloaded Data</h3>
					{Object.entries(groupedData).map(([name, villages]) => (
						<div
							key={name}
							className={`name-section rounded-2xl mb-8 ${
								activeGroup === name ? " focus:outline-none" : ""
							}`}
						>
							{/* Name Group Header */}
							{/* <button onClick={() => toggleGroup(name)} className="name-header p-5 text-l font-bold text-black w-full text-left">
              
              <span className="block text-sm mt-1 font-semibold text-gray-400"></span>
            </button> */}
							<div
								className={`village-group ${
									activeGroup === name ? "block" : "hidden"
								} mt-4`}
							>
								{Object.entries(villages).map(([villageName, items]) => (
									<div key={villageName} className="date-section my-4">
										{/* Village Subgroup Header */}
										{/* <h3 className="village-header pt-2 text-lg font-medium mx-8"><span className="text-sm pr-4 justify-center text-gray-400">Village Name</span>{villageName} </h3> */}
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
											{items.map((item) => (
												<ServiceCard
													key={item.id}
													item={item}
													tokens={tokens}
												/>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
					{noNewItems ? (
						<p className="text-gray-600">No new items to load.</p>
					) : (
						<button
							onClick={loadMore}
							className="bg-gray-300 border border-gray-400 text-black py-2 px-4 mt-4 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
						>
							Load more
						</button>
					)}
				</div>
			)}
			<div className="right-side hidden md:block">
				{/* /This div will always show on desktop or laptop, regardless of showHistory value */}
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className="">
						<h3 className="font-bold text-2xl pt-4 pb-6">Downloaded Data</h3>
						{Object.entries(groupedData).map(([name, villages]) => (
							<div
								key={name}
								className={`name-section rounded-2xl mb-8 bg-white ${
									activeGroup === name
										? "border border-black focus:outline-none"
										: ""
								}`}
							>
								{/* Name Group Header */}
								<button
									onClick={() => toggleGroup(name)}
									className="name-header p-5 text-l font-bold text-black w-full text-left"
								>
									{name}
									<span className="block text-sm mt-1 font-semibold text-gray-400">
										Client Name
									</span>
								</button>
								<div
									className={`village-group ${
										activeGroup === name ? "block" : "hidden"
									}`}
								>
									{Object.entries(villages).map(([villageName, items]) => (
										<div className="">
											<div
												key={villageName}
												className="date-section border-t border-gray-300"
											>
												{/* Village Subgroup Header */}
												<h3 className="village-header pt-2 text-lg font-medium mx-8">
													<span className="text-sm pr-4 justify-center text-gray-400">
														Village Name
													</span>
													{villageName}{" "}
												</h3>

												<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-6 mb-4 ">
													{items.map((item) => (
														<ServiceCard
															key={item.id}
															item={item}
															tokens={tokens}
														/>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
						{noNewItems ? (
							<p>No new items to load.</p>
						) : (
							<button
								onClick={loadMore}
								className="bg-gray-300 border border-gray-400 text-black py-2 px-4 mt-4 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
							>
								Load more
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default RightSide;
