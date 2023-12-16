// Import React and other libraries
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

// Define the SearchDropdown component
function SearchDropdown(props) {
	// Use state hooks to store the options and the selected option
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState(null);
	const [, updateState] = React.useState();

	// A function to fetch the villages from the API based on the search string
	const fetchVillages = async (searchString) => {
		setOptions([]);
		try {
			const response = await axios.post(
				props.apiUrl + "location/v2/fetch/village",
				{
					searchString: searchString,
					siteName: props.siteName,
				}
			);
			// Convert the result array into an array of objects with label and value properties
			const villages = response.data.result.map((village) => {
				// Split the village string by comma and get an array of substrings
				// Return an object with label and value properties
				return {
					// Label will be the second, third and fourth part of the string
					label: village.village_name,
					// Value will be the first part of the string
					value: village.villageId,
					plot_list: village.plot_list,
					is_drop_down_required: village.is_drop_down_required,
				};
			});
			// Set the options state with the fetched villages
			// setOptions(villages);
			setOptions(villages);
			updateState({});
		} catch (error) {
			console.error(error);
		}
	};

	// A function to handle the change event of the select component
	const handleChange = (selectedOption) => {
		// Set the selected state with the selected option
		setSelected(selectedOption);
		// Call the onSelect prop function with the selected option
		props.onSelect(selectedOption);
	};

	// A variable to hold the timeout ID
	let timeoutId;

	// A function to handle the input change event of the select component
	const handleInputChange = (inputValue) => {
		// Clear the previous timeout, if any
		clearTimeout(timeoutId);

		// Create a new timeout that will call fetchVillages after 300ms of inactivity
		timeoutId = setTimeout(() => {
			// Fetch the villages from the API with the input value as the search string
			if (inputValue.length > 2) {
				fetchVillages(inputValue);
			} else {
				// Optionally, you can handle cases where the input is too short
			}
		}, 300);
	};

	// Return the JSX code for rendering the select component
	return (
		<div>
			<Select
				value={selected}
				onChange={handleChange}
				onInputChange={handleInputChange}
				options={options}
				placeholder="Search for a village..."
				// Add the onSelect prop here
				onSelect={props.onSelect}
			/>
		</div>
	);
}

// Export the SearchDropdown component
export default SearchDropdown;
