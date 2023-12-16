import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "src/components/dropdown_v2";
import RightSide from "src/components/fetchdata";
import carouselimage1 from "src/images/1.png";
import carouselimage2 from "src/images/2.png";
import logo from "src/images/logo.png";
import { TOKEN_TYPE } from "src/utils/constants";
// A component for the hello world screen
function HelloWorld({ userId, tokens, setShowHistory, showHistory }) {
	const accessToken = tokens.access;
	const [selected, setSelected] = useState(null);
	const [extract, setExtract] = useState(false);
	const [docsearch, setDocsearch] = useState(false);

	let apiUrl;
	if (process.env.NODE_ENV === "development") {
		apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
	} else {
		apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
	}

	const handleSelect = (option) => {
		// Set the selected state with the option
		setSelected(option.value);
		// You can also access the option's label and value here
		console.log(option.value);
	};
	function handleSubmit(e) {
		e.preventDefault(); // Prevent the default form submission behavior
		// Get the authorization header and the data from the curl command

		const authHeader = "Bearer " + accessToken;
		const form = e.target; // Get the form element
		const searchNumber = form.elements.number.value;
		const startYear = parseInt(form.elements.ddlstartyear.value);
		const endYear = parseInt(form.elements.ddlendyear.value);
		// const phonenumber = form.elements.phonenumber.value;
		const name = form.elements.name.value;

		const data = {
			searchNumber: searchNumber,
			startYear: startYear,
			endYear: endYear,
			villageId: selected,
			userId: userId,
			name: name,
			phone: "",
			extract: extract,
			docsearch: docsearch,
		};

		// Call the API using the fetch method
		fetch(apiUrl + "esearch/fetch/document", {
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

	const handleToggleChange = () => {
		// Toggle the extract value when the switch changes
		console.log("old Extract:", extract);
		setExtract(!extract);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-4xl font-bold text-center mb-4">
				Welcome to automated esearch across the years
			</h1>
			<p className="text-center mb-4">
				Please enter the number you wish to search for. <br /> Select the start
				year. End year of search will be 2023. <br /> Select the village name
				from Nagpur (Urban) and click Go. <br />
				Once finished, file will download as csv. This might take upto few
				minutes.
			</p>
			<form
				onSubmit={handleSubmit}
				action="/download"
				method="post"
				id="searchForm"
				className="max-w-md mx-auto p-4 rounded-lg border"
			>
				<div className="mb-4">
					<input
						type="text"
						name="name"
						required
						placeholder="Client Name"
						className="w-full px-3 py-2 border bg-[#ededed] rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500"
					/>
				</div>

				<div className="mb-4">
					<label
						for="extract"
						className="block mb-2 text-sm font-medium text-gray-700"
					>
						Extract data?
					</label>
					<div className="relative inline-block w-10 h-6 align-middle select-none">
						<input
							type="checkbox"
							name="extract"
							id="extractToggle"
							className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
							checked={extract}
							onChange={handleToggleChange}
						/>
						<label
							className="inline-block pl-[0.15rem] hover:cursor-pointer"
							for="extractToggle"
						></label>
					</div>
				</div>

				<div className="mb-4">
					<input
						type="text"
						name="number"
						required
						placeholder="Number"
						className="w-full px-3 py-2 border bg-[#ededed] rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500"
					/>
				</div>
				<div className="mb-4">
					<label
						for="ddlvillage"
						className="block mb-2 text-sm font-medium text-gray-700"
					>
						Village:
					</label>
					{/* <select name="ddlvillage" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500">
                
              </select> */}
					<SearchDropdown
						onSelect={handleSelect}
						siteName="Free Search"
						apiUrl={apiUrl}
					/>
				</div>
				<div className="flex">
					<div className="mb-4 flex-grow">
						<label
							for="ddlstartyear"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							Start year:
						</label>
						<select
							name="ddlstartyear"
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500"
						>
							{Array.from({ length: 32 }, (v, i) => i + 1992).map((year) => (
								<option value={year}>{year}</option>
							))}
						</select>
					</div>
					<div className="mb-4 flex-grow">
						<label
							for="ddlendyear"
							className="block mb-2 text-sm font-medium text-gray-700"
						>
							End year:
						</label>
						<select
							name="ddlendyear"
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500"
						>
							{Array.from({ length: 33 }, (v, i) => i + 1992).map((year) => (
								<option value={year}>{year}</option>
							))}
						</select>
					</div>
				</div>
				<div className="text-center space-x-4">
					<input
						type="submit"
						id="goButton"
						value="Search"
						className="px-4 py-2 bg-green-700 text-white font-semibold rounded-full hover:bg-green-900 focus:outline-none focus:ring ring-green-600 focus:border-green-500"
					/>
					{/* <SubmitButton /> */}
					<button
						className="bg-gray-100 lg:hidden border border-gray-300 text-black py-2 px-4 rounded hover:bg-gray-600"
						onClick={() => setShowHistory(true)}
					>
						Show History
					</button>
				</div>
			</form>
		</div>
	);
}

// A component for the login screen
function Login({ setPhoneNumber, setOtpSent, otpSent }) {
	const [dialCode, setDialCode] = useState(91);
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");

	// A function to handle the submit button click
	function handleSubmit(e) {
		e.preventDefault();
		// Validate the phone number
		if (phone.length !== 10 || isNaN(phone)) {
			setError("Please enter a valid 10-digit phone number");
			return;
		}

		let apiUrl;
		if (process.env.NODE_ENV === "development") {
			apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
		} else {
			apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
		}
		console.log("process.env:", process.env);
		// Call the generateotp API
		axios
			.post(apiUrl + "authenticator/generate_otp", {
				dial_code: "91",
				phone_number: phone,
			})
			.then((response) => {
				// If successful, set the phone number and otp sent state
				setPhoneNumber(`${dialCode}${phone}`);
				setOtpSent(true);
				console.log(otpSent, setOtpSent);
			})
			.catch((error) => {
				// If error, display the error message
				setError(error.response.data.message);
			});
	}

	return (
		<div className="w-full max-w-xs">
			<form className=" px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
				<img src={logo} alt="logo" className="my-4 w-12 h-auto" />
				<h1 className="text-2xl font-bold mb-4 text-gray-700">
					Log into BhuMe
				</h1>
				<div className="mb-6">
					<input
						className="w-full px-3 py-2 border bg-[#ededed] rounded-lg focus:outline-none focus:ring ring-green-500 focus:border-green-500"
						id="phone"
						type="text"
						placeholder="Enter your phone number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className="flex items-center justify-between">
					<button
						className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
			{error && <p className="text-red-500 text-xs italic">{error}</p>}
		</div>
	);
}

// A component for the otp screen
function Otp({ phoneNumber, setLoggedIn, setUserData, setOtpSent }) {
	let navigate = useNavigate();

	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");

	// A function to handle the submit button click
	function handleSubmit(e) {
		e.preventDefault();
		// Validate the otp
		if (otp.length !== 6 || isNaN(otp)) {
			setError("Please enter a valid 6-digit otp");
			return;
		}

		let apiUrl;
		if (process.env.NODE_ENV === "development") {
			apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
		} else {
			apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
		}
		// Call the verifyOtp API
		axios
			.post(apiUrl + "authenticator/verify_otp", {
				dial_code: phoneNumber.slice(0, 2),
				phone_number: phoneNumber.slice(2),
				otp: otp,
			})
			.then((response) => {
				if (response.data.message === "Failed to Verify Otp") {
					setError("Failed to verify OTP. Please enter the correct OTP.");
					setOtp(""); // Clear the OTP input field
				} else {
					localStorage.setItem(
						"userData",
						JSON.stringify(response.data.result)
					);
					localStorage.setItem(
						TOKEN_TYPE,
						response.data.result?.tokens?.access
					);
					// If successful, set the logged in and user data state
					// setLoggedIn(true);
					navigate("/");
					setUserData(response.data.result);
				}
			})
			.catch((error) => {
				// If error, display the error message
				setError(error.response.data.message);
			});
	}
	function handleEdit() {
		setOtpSent(false);
	}
	return (
		<div className="w-full max-w-xs">
			<form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
				<img src={logo} alt="logo" className="my-4 w-12 h-auto" />
				<h1 className="text-2xl font-bold mb-4 text-gray-700">Enter OTP</h1>
				<p className="text-gray-700 mb-4">
					We have sent an OTP to <b>+{phoneNumber}</b>
					<span
						className="text-blue-500 cursor-pointer ml-2"
						onClick={handleEdit}
					>
						Edit
					</span>
				</p>
				<div className="mb-6">
					<input
						className="w-full px-3 py-2 border bg-[#ededed] rounded-lg focus:outline-none focus:ring ring-green-600 focus:border-green-500"
						id="otp"
						type="text"
						placeholder="Enter OTP"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
					/>
				</div>
				{error && <p className="text-red-500 text-xs italic">{error}</p>}
				<div className="flex items-center justify-between">
					<button
						className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Verify OTP
					</button>
				</div>
			</form>
		</div>
	);
}

// The main component for the webapp
function App() {
	let navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useState(false); // A state to track if the user is logged in or not
	const [userData, setUserData] = useState(null); // A state to store the user data from the verifyOtp API response
	const [phoneNumber, setPhoneNumber] = useState(""); // A state to store the phone number entered by the user on the login screen
	const [otpSent, setOtpSent] = useState(false); // A state to track if the otp has been sent or not
	const [showHistory, setShowHistory] = useState(); // A state to track if the user is logged in or not
	// A useEffect hook to update the local storage when the user data changes
	useEffect(() => {
		// If there is any user data, store it in the local storage
		if (userData) {
			localStorage.setItem("userData", JSON.stringify(userData));
		}
		console.log(showHistory);
	}, [userData]);
	const handleLogout = () => {
		setLoggedIn(false);
		setUserData(null);
		setShowHistory(false);
	};
	// Define a function that checks if the access token is expired
	function isTokenExpired(token) {
		// Decode the token and get its expiration date
		const decodedToken = jwtDecode(token);
		console.log("istoken func called");
		const expirationDate = new Date(decodedToken.exp * 1000);
		// Compare it with the current date
		const currentDate = new Date();
		// Return true if expired, false if not
		return expirationDate < currentDate;
	}
	// Define a function that refreshes the access token
	async function refreshfunc(refresh) {
		const storedUserData = JSON.parse(localStorage.getItem("userData"));
		// Determine the API URL based on the environment variable
		let apiUrl;
		if (process.env.NODE_ENV === "development") {
			apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
		} else {
			apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
		}
		axios
			.post(
				apiUrl + "authenticator/refresh",
				{ refresh: refresh },
				{ headers: { "Content-Type": "application/json" } }
			)

			.then((response) => {
				// If successful, set the logged in and user data state
				console.log("api ne sahi respond kiya");
				const newUserData = {
					...storedUserData,
					tokens: { ...storedUserData.tokens, access: response.data.access },
				};
				localStorage.setItem(TOKEN_TYPE, response.data.result?.tokens?.access);
				// setLoggedIn(true);
				navigate("/");
				setUserData(newUserData);
				localStorage.setItem("userData", JSON.stringify(newUserData));
			})
			.catch((error) => {
				// If error, display the error message
				console.error(error);
				setLoggedIn(false);
				setUserData(null);
				console.log("redirecting to login page");
			});
	}

	// Define a useEffect hook that runs when the app renders
	useEffect(() => {
		// Get the user data from the local storage
		const storedUserData = JSON.parse(localStorage.getItem("userData"));
		// If there is any user data, check if the access token is expired
		if (storedUserData) {
			const accessToken = storedUserData.tokens.access;
			const refreshToken = storedUserData.tokens.refresh;

			console.log(accessToken);
			if (isTokenExpired(accessToken)) {
				// If it is expired, refresh it and update the user data state and local storage
				console.log("token had expired");
				refreshfunc(refreshToken);
				// setLoggedIn(false);
				// setUserData(null);
			} else {
				// If it is not expired, set the logged in and user data state
				setLoggedIn(true);
				console.log("token not expired");
				setUserData(storedUserData);
			}
		}
	}, []);

	return (
		<div
			className="flex justify-center h-screen"
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${carouselimage2})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div
				id="notification"
				className="hidden fixed bottom-5 left-0 right-0 mx-auto w-96 bg-green-500 text-white p-4 rounded-lg text-center shadow-lg transform transition-opacity duration-300"
			></div>
			<div
				className="flex mx-auto grid grid-cols-12 gap-0 w-screen "
				style={{ margin: "0 0" }}
			>
				{/* <!-- center screen --> */}
				{/* {loggedIn ? (
					showHistory ? null : (
						<div className="h-full sticky top-0 col-span-12 lg:col-span-4 bg-white mx-auto my-auto shadow-md rounded ">
							<HelloWorld
								userId={userData.userId}
								tokens={userData.tokens}
								showHistory={showHistory}
								setShowHistory={setShowHistory}
							/>
						</div>
					)
				) : otpSent ? (
					<div className="flex items-center justify-center bg-white col-span-12 w-[40%] h-[60%] mx-auto my-auto shadow-md rounded ">
						<Otp
							phoneNumber={phoneNumber}
							setLoggedIn={setLoggedIn}
							setUserData={setUserData}
							setOtpSent={setOtpSent}
						/>
					</div>
				) : (
					<div className="flex items-center justify-center col-span-12 bg-white w-screen h-screen md:w-[40%] md:h-[60%] mx-auto my-auto shadow-md rounded ">
						<Login setPhoneNumber={setPhoneNumber} setOtpSent={setOtpSent} />
					</div>
				)} */}

				{otpSent ? (
					<div className="flex items-center justify-center bg-white col-span-12 w-[40%] h-[60%] mx-auto my-auto shadow-md rounded ">
						<Otp
							phoneNumber={phoneNumber}
							setLoggedIn={setLoggedIn}
							setUserData={setUserData}
							setOtpSent={setOtpSent}
						/>
					</div>
				) : (
					<div className="flex items-center justify-center col-span-12 bg-white w-screen h-screen md:w-[40%] md:h-[60%] mx-auto my-auto shadow-md rounded ">
						<Login setPhoneNumber={setPhoneNumber} setOtpSent={setOtpSent} />
					</div>
				)}

				{/* <!-- right side --> */}
				{/* {loggedIn && (
					<div className="right-side col-span-12 lg:col-span-8 items-start justify-start bg-[#ededed]">
						<RightSide
							tokens={userData.tokens}
							userId={userData.userId}
							showHistory={showHistory}
							setShowHistory={setShowHistory}
						/>
					</div>
				)} */}
			</div>
		</div>
	);
}

export default App;
