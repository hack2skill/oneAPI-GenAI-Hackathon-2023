import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { HomeIcon, ClockIcon } from "@heroicons/react/outline";
import SearchDropdown from "src/components/dropdown";
import OrderModal from "src/components/orderModal";
import RightSide from "src/components/history";
import carouselimage1 from "src/images/1.png";
import carouselimage2 from "src/images/2.png";
import logo from "src/images/logo.png";
import { useNavigate } from "react-router-dom";

// A component for the hello world screen
function AnonymousPage({ loggedIn, setLoggedIn, apiUrl, setUserData }) {
	// Header component
	const [showOrderModal, setShowOrderModal] = useState(false);
	const [currentSiteName, setCurrentSiteName] = useState("Bhulekh_v2");
	const [documentName, setDocumentName] = useState("7/12");
	const [showLogin, setShowLogin] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const documentItems = [
		{
			id: 1,
			title: "7/12 Extract",
			subtitle: "Tap for details",
			icon: "📄", // Replace with an SVG or image path if needed
			siteName: "Bhulekh",
			documentName: "7/12_new",
		},
		{
			id: 2,
			title: "8A",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Bhulekh",
			documentName: "8A",
		},
		{
			id: 3,
			title: "Akhiv Patrika",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Bhulekh_v2",
			documentName: "Akhiv_Patrika",
		},
		{
			id: 4,
			title: "Index 2 (II)",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Free search",
			documentName: "Esearch",
		},
	];

	const propertyReportItems = [
		{
			id: 1,
			title: "Title Search",
			subtitle: "Tap for details",
			icon: "📄", // Replace with an SVG or image path if needed
		},
		{
			id: 2,
			title: "Valuation Check",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
		},
	];

	const handleCardClick = (siteName, documentName, id) => {
		if (loggedIn) {
			if (id === 4) {
				window.open("https://app.bhume.in", "_blank");
			} else {
				setShowOrderModal(true); // Show order modal if logged in
				setCurrentSiteName(siteName);
				setDocumentName(documentName);
			}
		} else {
			// Here, instead of navigating, you could also trigger a login modal or a login action
			// For simplicity, we'll show the LoginScreen component
			// Show login screen if not logged in
			// Implement your logic to handle login
			// setShowOrderModal(true); // Show order modal if logged in
			// setCurrentSiteName(siteName);
			// setDocumentName(documentName);
			setShowLogin(true);
		}
	};

	const closeOrderModal = () => {
		setShowOrderModal(false); // Close the modal
	};

	const closeLogin = () => {
		setShowLogin(false);
	};

	return (
		<>
			{!showLogin && (
				<div className="sticky top-0 lg:col-span-4 col-span-12 bg-white w-full h-full mx-auto my-auto shadow-md rounded z-10">
					<div
						className="flex justify-center h-screen"
						style={{
							backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${carouselimage2})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					>
						<div className="flex flex-col min-h-screen bg-gray-300 w-full">
							<Header name="" />
							<main className="p-4 flex-1 bg-gray-100 rounded-2xl">
								<h2 className="text-xl font-bold mb-4">Document Search</h2>
								<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
									{documentItems.map((item) => (
										<DocumentCard
											key={item.id}
											title={item.title}
											subtitle={item.subtitle}
											icon={item.icon}
											siteName={item.siteName}
											onCardClick={() =>
												handleCardClick(
													item.siteName,
													item.documentName,
													item.id
												)
											}
										/>
									))}
								</div>
								<div className="mt-8">
									<h2 className="text-xl font-bold mb-4">Property Report</h2>
									<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
										{propertyReportItems.map((item) => (
											<DocumentCard
												key={item.id}
												title={item.title}
												subtitle={item.subtitle}
												icon={item.icon}
												siteName={item.siteName}
												onCardClick={() =>
													handleCardClick(
														item.siteName,
														item.documentName,
														item.id
													)
												}
											/>
										))}
									</div>
								</div>
							</main>
						</div>
					</div>
				</div>
			)}

			{/* <NavigationBar /> */}

			<div
				className="flex mx-auto grid grid-cols-12 gap-0 w-screen "
				style={{ margin: "0 0" }}
			>
				{showLogin &&
					(otpSent ? (
						<div className="flex items-center justify-center col-span-12 bg-white w-screen h-screen md:w-[40%] md:h-[60%] mx-auto my-auto shadow-md rounded">
							<Otp
								phoneNumber={phoneNumber}
								setLoggedIn={setLoggedIn}
								setUserData={setUserData}
								setOtpSent={setOtpSent}
							/>
						</div>
					) : (
						<div className="flex items-center justify-center col-span-12 bg-white w-screen h-screen md:w-[40%] md:h-[60%] mx-auto my-auto shadow-md rounded">
							<Login
								setPhoneNumber={setPhoneNumber}
								setOtpSent={setOtpSent}
								otpSent={otpSent}
							/>
						</div>
					))}
			</div>
		</>
	);
}

const Header = ({ name, navigate }) => (
	<div className="sticky w-full z-10 top-0 bg-gray-300 text-left p-6 z-10">
		{/* Icon */}
		<div
			className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex items-center"
			onClick={() => navigate("/")}
		>
			<img src={logo} alt="logo" className="h-8 w-8 mr-2" />
			<h1 className="text-2xl font-bold">BhuMe</h1>
		</div>
		<h2 className="text-gray-700 text-xl font-bold pt-5">Morning {name}!</h2>
		{/* ... other header contents ... */}
	</div>
);

// Document card component
const DocumentCard = ({ title, subtitle, icon, onCardClick, siteName }) => (
	<div
		onClick={onCardClick}
		className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4"
	>
		{/* Icon section */}
		<div className="w-full flex ">
			{icon} {/* This will be your icon component or image */}
		</div>

		{/* Title and subtitle section */}
		<div className="flex-1 w-full text-left mt-4">
			<p className="text-sm font-medium text-gray-900 truncate">{title}</p>
			<p className="text-sm text-gray-500 truncate">{subtitle}</p>
		</div>
	</div>
);

// Property report card component
const PropertyReportCard = ({ title, subtitle }) => (
	<div className="bg-white shadow-md rounded-lg p-4 m-2">
		{/* Similarly, include SVG icons */}
		<h3 className="text-lg font-semibold">{title}</h3>
		<p className="text-gray-600">{subtitle}</p>
	</div>
);

// Navigation Bar component
const NavigationBar = ({ setShowHistory }) => (
	<nav className="fixed sm:hidden inset-x-0 font-bold rounded-t-lg bottom-0 bg-gray-800 text-white p-4 flex justify-center">
		{/* Navigation items */}
		<div className="flex space-x-4">
			{/* Home Button */}
			<button
				className="  py-2 px-4 rounded hover:border hover:boder-gray-300 "
				onClick={() => setShowHistory(false)}
			>
				Home
			</button>

			{/* Show History Button */}
			<button
				className=" py-2 px-4 rounded hover:border hover:boder-gray-300 "
				onClick={() => setShowHistory(true)}
			>
				History
			</button>
		</div>
	</nav>
);

function MainPage({ loggedIn, setLoggedIn, apiUrl, tokens, userId }) {
	let navigate = useNavigate();

	// Header component
	const accessToken = tokens ? tokens.access : "";
	const [showOrderModal, setShowOrderModal] = useState(false);
	const [currentSiteName, setCurrentSiteName] = useState("Bhulekh_v2");
	const [documentName, setDocumentName] = useState("7/12");
	const [showHistory, setShowHistory] = useState(); // A state to track if the user is logged in or not
	const documentItems = [
		{
			id: 1,
			title: "7/12 Extract",
			subtitle: "Tap for details",
			icon: "📄", // Replace with an SVG or image path if needed
			siteName: "Bhulekh",
			documentName: "7/12_new",
		},
		{
			id: 2,
			title: "8A",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Bhulekh",
			documentName: "8A",
		},
		{
			id: 3,
			title: "Akhiv Patrika",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Bhulekh_v2",
			documentName: "Akhiv_Patrika",
		},
		{
			id: 4,
			title: "Index 2 (II)",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
			siteName: "Free search",
			documentName: "Esearch",
		},
	];

	const propertyReportItems = [
		{
			id: 1,
			title: "Title Search",
			subtitle: "Tap for details",
			icon: "📄", // Replace with an SVG or image path if needed
		},
		{
			id: 2,
			title: "Valuation Check",
			subtitle: "Tap for details",
			icon: "📑", // Replace with an SVG or image path if needed
		},
	];

	const handleCardClick = (siteName, documentName, id) => {
		if (loggedIn) {
			if (id === 4) {
				window.open("https://app.bhume.in/auth/login", "_blank");
			} else {
				setShowOrderModal(true); // Show order modal if logged in
				setCurrentSiteName(siteName);
				setDocumentName(documentName);
			}
		} else {
			// Here, instead of navigating, you could also trigger a login modal or a login action
			// For simplicity, we'll show the LoginScreen component
			// Show login screen if not logged in
			// Implement your logic to handle login
			// setShowOrderModal(true); // Show order modal if logged in
			// setCurrentSiteName(siteName);
			// setDocumentName(documentName);
		}
	};

	const closeOrderModal = () => {
		setShowOrderModal(false); // Close the modal
	};

	return (
		<>
			{showHistory && loggedIn && (
				<div className="flex flex-col min-h-screen bg-gray-300 w-full">
					<Header navigate={navigate} name="" />
					<div className="right-side col-span-1 lg:col-span-8 items-start justify-start bg-[#ededed]">
						<RightSide
							tokens={tokens}
							userId={userId}
							showHistory={showHistory}
							setShowHistory={setShowHistory}
						/>
					</div>
				</div>
			)}
			{!showHistory && (
				<div className="flex flex-col min-h-screen bg-gray-300 w-full">
					<Header navigate={navigate} name="" />
					<main className="p-4 flex-1 bg-gray-100 rounded-2xl">
						<h2 className="text-xl font-bold mb-4">Document Search</h2>
						<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
							{documentItems.map((item) => (
								<DocumentCard
									key={item.id}
									title={item.title}
									subtitle={item.subtitle}
									icon={item.icon}
									siteName={item.siteName}
									onCardClick={() =>
										handleCardClick(item.siteName, item.documentName, item.id)
									}
								/>
							))}
						</div>
						<div className="mt-8">
							<h2 className="text-xl font-bold mb-4">Property Report</h2>
							<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
								{propertyReportItems.map((item) => (
									<DocumentCard
										key={item.id}
										title={item.title}
										subtitle={item.subtitle}
										icon={item.icon}
										siteName={item.siteName}
										onCardClick={() =>
											handleCardClick(item.siteName, item.documentName, item.id)
										}
									/>
								))}
							</div>
						</div>
					</main>
				</div>
			)}
			{showOrderModal && (
				<OrderModal
					onClose={closeOrderModal}
					setShowOrderModal={setShowOrderModal}
					setShowHistory={setShowHistory}
					siteName={currentSiteName}
					apiUrl={apiUrl}
					documentName={documentName}
					accessToken={accessToken}
				/>
			)}

			<NavigationBar setShowHistory={setShowHistory} />
		</>
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
				<h2 className="text-xl mb-4 text-gray-700">
					Download 7/12, Akhiv Patrika, Index 2
				</h2>
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
						Register
					</button>
				</div>
			</form>
			{error && <p className="text-red-500 text-xs italic">{error}</p>}
		</div>
	);
}

// A component for the otp screen
function Otp({ phoneNumber, setLoggedIn, setUserData, setOtpSent }) {
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
					// If successful, set the logged in and user data state
					setLoggedIn(true);
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
export const PropertyApp = () => {
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
	let apiUrl;
	if (process.env.NODE_ENV === "development") {
		apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
	} else {
		apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
	}
	async function refreshfunc(refresh) {
		const storedUserData = JSON.parse(localStorage.getItem("userData"));
		// Determine the API URL based on the environment variable

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
				setLoggedIn(true);
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
				className="hidden fixed bottom-5 left-0 right-0 mx-auto w-96 bg-green-500 text-white p-4 rounded-lg text-center shadow-lg transform transition-opacity duration-300 z-1000"
			></div>
			<div
				className="flex mx-auto grid grid-cols-12 gap-0 w-screen "
				style={{ margin: "0 0" }}
			>
				{/* <!-- center screen --> */}

				{loggedIn ? (
					showHistory ? null : (
						<div className="sticky z-10 top-0 sm:col-span-4 col-span-12 bg-white w-full h-full mx-auto my-auto shadow-md rounded">
							<MainPage
								loggedIn={loggedIn}
								setLoggedIn={setLoggedIn}
								apiUrl={apiUrl}
								tokens={userData.tokens}
								userId={userData.userId}
							/>
						</div>
					)
				) : otpSent ? (
					<div className="flex items-center justify-center bg-white col-span-12 w-full h-full mx-auto my-auto shadow-md rounded ">
						<Otp
							phoneNumber={phoneNumber}
							setLoggedIn={setLoggedIn}
							setUserData={setUserData}
							setOtpSent={setOtpSent}
						/>
					</div>
				) : (
					<AnonymousPage
						loggedIn={loggedIn}
						setLoggedIn={setLoggedIn}
						apiUrl={apiUrl}
						setUserData={setUserData}
					/>
				)}

				{/* <!-- right side --> */}
				{loggedIn && (
					<div className="right-side col-span-12 sm:col-span-8 items-start justify-start bg-[#ededed]">
						<RightSide
							tokens={userData.tokens}
							userId={userData.userId}
							showHistory={showHistory}
							setShowHistory={setShowHistory}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
