// import Select from 'react-dropdown-select'
// import React, { useState, useEffect } from 'react';

// export const Dropdown = ({ selectedOptions, setSelectedOptions }) => {
//   const [options, setOptions] = useState ([
//     { id: 1, country: "America" },
//     { id: 2, country: "India" },
//     { id: 3, country: "Africa" },
//   ])

//   useEffect (() => {
//     // fetch data from the API and update the options state
//     fetch ('https://current-backend-if43mroqyq-el.a.run.app/location/fetch/village', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify ({
//         "searchString": "a"
//       })
//     })
//     .then (response => response.json ())
//     .then (data => {
//       // map the data to the format required by the Select component
//       console.log(data.result)
//       const newOptions = data.result.map (item => {
//         const parts = item.split(",");
//         return { value: parts[0], label: parts[1].concat(",", parts[2], ",", parts[3]).trim() };
//       })
//       setOptions (newOptions)
//     })
//     .catch (error => console.error (error))
//   }, [])

//   return (
//     <>
//       <div>
//         <Select className="w-full px-3 py-2 border rounded-lg bg-white shadow-sm flex items-center focus:outline-none focus:ring focus:border-blue-300"
//           options= { options }
//           values= { selectedOptions }
//           onChange= { (values) => {
//             setSelectedOptions ([...values])
//             // print in console the value of dropdown clicked
//             console.log (values[0].value)
//             console.log(selectedOptions)
//           } }
//           onSearch= { (searchText) => {
//             // hit the API with searchString as the text searched
//             fetch ('https://current-backend-if43mroqyq-el.a.run.app/location/fetch/village', {
//               method: 'POST',
//               headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify ({
//                 "searchString": searchText,
//               })
//             })
//             .then (response => response.json ())
//             .then (data => {
//               // map the data to the format required by the Select component
//               const newOptions = data.result.map (item => {
//                 const parts = item.split(",");
//                 return { value: parts[0], label: parts[1].concat(",", parts[2], ",", parts[3]).trim() };
//               })
//               setOptions (newOptions)
//             })
//             .catch (error => console.error (error))
//           } }
//         />
//       </div>
//     </>
//   );
// }

// import Select from 'react-dropdown-select'
// import React, { useState, useEffect } from 'react';

// export const Dropdown = ({ selectedOptions, setSelectedOptions }) => {
//   const [options, setOptions] = useState ([
//     { value: 1, label: "America" },
//     { value: 2, label: "India" },
//     { value: 3, label: "Africa" },
//   ])

//   // state variable for the selected value
//   const [selectedValue, setSelectedValue] = useState (null);

//   useEffect (() => {
//     // fetch data from the API and update the options state
//     fetch ('https://current-backend-if43mroqyq-el.a.run.app/location/fetch/village', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify ({
//         "searchString": "nagpur"
//       })
//     })
//     .then (response => response.json ())
//     .then (data => {
//       // map the data to the format required by the Select component

//       const newOptions = data.result.map (item => {
//         const parts = item.split(",");
//         return { value: parts[0], label: parts[1].concat(",", parts[2], ",", parts[3]).trim() };
//       })
//       setOptions (newOptions)
//       console.log(options)
//     })
//     .catch (error => console.error (error))
//   }, [])

//   return (
//     <>
//       <div>
//         <Select className="w-full px-3 py-2 border rounded-lg bg-white shadow-sm flex items-center focus:outline-none focus:ring focus:border-blue-300"
//           options= { options }
//           values= { selectedOptions }
//           onChange= { (values) => {
//             setSelectedOptions ([...values])
//             // print in console the value of dropdown clicked

//             // update the selected value state
//             // setSelectedValue (values)

//           } }
//           onSearch= { (searchText) => {
//             // hit the API with searchString as the text searched
//             fetch ('https://current-backend-if43mroqyq-el.a.run.app/location/fetch/village', {
//               method: 'POST',
//               headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify ({
//                 "searchString": searchText,
//               })
//             })
//             .then (response => response.json ())
//             .then (data => {
//               // map the data to the format required by the Select component
//               const newOptions = data.result.map (item => {
//                 const parts = item.split(",");
//                 return { value: parts[0], label: parts[1].concat(",", parts[2], ",", parts[3]).trim() };
//               })
//               setOptions (newOptions)
//               console.log(searchText)
//               console.log(options)
//             })
//             .catch (error => console.error (error))
//           } }
//           // clear the selected value with null
//           value= {selectedValue}
//         />
//       </div>
//     </>
//   );
// }

// Import React and other libraries
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

// Define the SearchDropdown component
function SearchDropdown(props) {
	// Use state hooks to store the options and the selected option
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState(null);

	// A function to fetch the villages from the API based on the search string
	const fetchVillages = async (searchString) => {
		try {
			const response = await axios.post(
				"https://current-backend-2jhph3k42a-el.a.run.app/location/v2/fetch/village",
				{
					searchString: searchString,
					siteName: "Free Search",
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
			setOptions(villages);
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
		<Select
			value={selected}
			onChange={handleChange}
			onInputChange={handleInputChange}
			options={options}
			placeholder="Search for a village..."
			// Add the onSelect prop here
			onSelect={props.onSelect}
		/>
	);
}

// Export the SearchDropdown component
export default SearchDropdown;
