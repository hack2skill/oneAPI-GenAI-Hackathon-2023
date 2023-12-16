import React, { useState, useEffect } from "react";
import SearchDropdown from "src/components/dropdown_v2";
import { useNavigate } from "react-router-dom";
// Define a debounce function (you can also use lodash for this)

const OrderModal = ({
	onClose,
	setShowOrderModal,
	setShowHistory,
	siteName,
	apiUrl,
	accessToken,
	documentName,
}) => {
	let navigate = useNavigate();
	const [villages, setVillages] = useState([]);
	const [selectedVillage, setSelectedVillage] = useState(null);
	const [searchNo, setSearchNo] = useState("");

	const handleSelect = (option) => {
		// Set the selected state with the option
		setSelectedVillage(option.value);
		// You can also access the option's label and value here
		console.log(option.value);
	};

	const handleSearchNoChange = (e) => {
		setSearchNo(e.target.value); // Update the searchNo state on input change
	};
	function handleSubmit(e) {
		e.preventDefault(); // Prevent the default form submission behavior
		// Get the authorization header and the data from the curl command

		const authHeader = "Bearer " + accessToken;

		const data = {
			documentName: documentName,
			searchNo: searchNo,
			villageId: selectedVillage,
		};

		// Call the API using the fetch method
		fetch(apiUrl + "service/create_service", {
			method: "POST", // Specify the request method
			headers: {
				// Specify the request headers
				accept: "application/json",
				Authorization: authHeader,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data), // Specify the request body as a JSON string
		})
			.then((response) => response.json()) // Parse the response as JSON
			.then((data) => {
				// Do something with the data

				const notification = document.getElementById("notification");
				notification.textContent = JSON.stringify(data.message, null, 0);
				notification.classList.remove("hidden");
				setTimeout(() => {
					notification.classList.add("hidden");
					notification.textContent = "";
				}, 5000); // Message will disappear after 5 seconds
				navigate("/property-doc-v2");
				// setShowHistory(true);
				setShowOrderModal(false);
			})
			.catch((error) => {
				// Handle any errors
				console.error(error); // For example, log the error to the console
				const notification = document.getElementById("notification");
				notification.textContent = "An error occurred while fetching data.";
				notification.classList.remove("hidden");
				setTimeout(() => {
					notification.classList.add("hidden");
					notification.textContent = "";
				}, 5000);
			});
	}

	return (
		<div className="fixed inset-0 z-50 flex justify-center items-end bg-gray-500 bg-opacity-75">
			<div className="bg-white p-4 rounded-t-lg shadow-lg w-full md:w-1/3 h-1/2">
				<div onClick={onClose} className="flex justify-between items-center">
					<h2 className="text-lg" onClick={onClose}>
						Request Details
					</h2>
					<button
						onClick={onClose}
						className="  font-bold py-1 px-2 rounded-full"
					>
						X
					</button>
				</div>
				{/* Dropdown for selecting village */}
				<div className="my-4">
					<label
						htmlFor="village-search"
						className="block text-sm font-medium text-gray-700"
					>
						Search Village
					</label>
					<SearchDropdown
						onSelect={handleSelect}
						siteName={siteName}
						apiUrl={apiUrl}
					/>
					<datalist id="villages">
						{villages.map((villages, index) => (
							<option key={index} value={villages.village_name} />
						))}
					</datalist>
				</div>
				{/* Input for entering survey number */}
				<div className="my-4">
					<label
						htmlFor="survey-number"
						className="block text-sm font-medium text-gray-700"
					>
						Survey Number
					</label>
					<input
						type="text"
						value={searchNo}
						onChange={handleSearchNoChange}
						className="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						placeholder="Enter survey number"
					/>
				</div>
				{/* Submit button */}
				<div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
					<button
						onClick={handleSubmit}
						className="bg-green-500 hover:bg-green-700 py-2 text-white font-bold w-full md:w-1/3 rounded-full"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default OrderModal;
