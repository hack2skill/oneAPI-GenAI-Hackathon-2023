import axios from "axios";
import SearchCard from "./components/searchCard";
import logo from "src/images/logo.png";

import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

import React, { useEffect, useState } from "react";
import Maps from "./components/map";
import { useNavigate } from "react-router-dom";

// The main component for the webapp
export const PropertyOnMap = () => {
	let navigate = useNavigate();
	// const { logOut } = useContext(AppContext);
	const storedUserData = JSON.parse(localStorage.getItem("userData"));
	// If there is any user data, check if the access token is expired

	const [docDetails, setDocDetails] = useState();
	const [selectedDoc, setSelectedDoc] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState(null);
	const [selectedOwnerDetails, setSelectedOwnerDetails] = useState(null);

	useEffect(() => {
		getData(currentPage, search);
	}, [currentPage]);

	function getData(page, searchNo) {
		let apiUrl;
		if (process.env.NODE_ENV === "development") {
			apiUrl = "https://current-backend-2k7ux24rnq-em.a.run.app/";
		} else {
			apiUrl = "https://current-backend-2jhph3k42a-el.a.run.app/";
		}

		const headers = {
			"Content-Type": "application/json",
		};
		headers.Authorization = `Bearer ${storedUserData.tokens.access}`;

		axios
			.post(
				apiUrl + "service/history",
				{
					userId: storedUserData.userId,
					page: page,
				},
				{ headers }
			)
			.then((response) => {
				setDocDetails(response?.data?.result?.data);
				const arr = response?.data?.result?.data.filter(
					(item, index) => +item.search_number === searchNo
				);
				if (arr.length) {
					getDetails(arr[0]);
				} else if (currentPage < 5 && search) {
					getDetails(null);
					setCurrentPage(currentPage + 1);
				} else {
					getDetails(null);
				}
				console.log(arr);
				// If successful, set the phone number and otp sent state
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const getDetails = (item) => {
		setSelectedDoc(item);
		if (
			item?.service_requests_history &&
			item?.service_requests_history.length &&
			item?.service_requests_history[0].ownership_detail.length > 10
		) {
			const ownerDetails = item?.service_requests_history[0].ownership_detail;
			let validJSONString = ownerDetails.replace(/'/g, '"');
			let resultArray = JSON.parse(validJSONString);
			setSelectedOwnerDetails(resultArray);
		}
	};

	const logOut = () => {
		localStorage.clear();
		navigate("/property-doc-v2");
	};

	const getOwenrDetails = (searchNo) => {
		setSearch(searchNo);
		getData(currentPage, searchNo);
	};

	return (
		<>
			<div className="flex h-[100vh] w-full bg-gray-100">
				<div className="h-[100vh] w-full flex flex-col bg-primary-background min-h-screen rounded ">
					<div className="w-full flex justify-between text-center md:p-6 md:pr-8 py-4 px-2 pl-0 pb-10  bg-[#C6C6C63D]">
						<div
							className="max-w-7xl sm:px-6 lg:px-8 flex"
							onClick={() => navigate("/")}
						>
							<img src={logo} alt="logo" className="h-8 w-8 mr-2" />
							<h1 className="text-2xl font-bold">BhuMe</h1>
						</div>
						<div className="hover:cursor-pointer" onClick={logOut}>
							Log Out
						</div>
					</div>
					<div className="flex flex-col md:flex-row">
						<div className="flex justify-center items-center h-[50vh] md:h-[90vh] w-full md:w-3/5 text-white">
							<div className="flex justify-center items-center">
								<Maps getDetails={getOwenrDetails} />
							</div>
						</div>
						<div className="bg-[#fff] p-5 w-full md:w-2/5">
							{selectedDoc && (
								<div>
									<div className="flex justify-between">
										<div className="w-1/3">
											<div>Service Name</div>
											<div className="text-lg font-bold">
												{selectedDoc?.service_name}
											</div>
										</div>
										<div className="w-1/3">
											<div>Search Number</div>
											<div className="text-lg font-bold">
												{selectedDoc?.search_number}
											</div>
										</div>
									</div>
									<div className="flex justify-between mt-4">
										<div className="w-1/3">
											<div>Village Name</div>
											<div className="text-lg font-bold">
												{selectedDoc?.village?.village_text_en}
											</div>
										</div>
										<div className="w-1/3">
											<div>District Name</div>
											<div className="text-lg font-bold">
												{selectedDoc?.village?.district_text_en}
											</div>
										</div>
									</div>
									<div className="text-lg font-bold mt-8 text-gray-500">
										Owner Details
									</div>
									<div className="flex justify-between my-5">
										<table className="table-auto">
											<thead>
												<tr>
													<th>Account Number</th>
													<th>Occupier Name</th>
													<th>Area</th>
													<th>Land Revenue</th>
												</tr>
											</thead>
											<tbody>
												{selectedOwnerDetails &&
													selectedOwnerDetails.length &&
													selectedOwnerDetails.map((owner, index) => (
														<tr key={index}>
															<td>{owner["Account Number"]}</td>
															<td>{owner["Occupier Name"]}</td>
															<td>{owner["Area"]}</td>
															<td>{owner["Land Revenue"]}</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
									<div className="flex flex-col items-center">
										<div
											style={{
												height: "auto",
												margin: "0 auto",
												maxWidth: 120,
												width: "100%",
											}}
										>
											<QRCode
												size={120}
												style={{
													height: "auto",
													maxWidth: "100%",
													width: "100%",
												}}
												value={
													selectedDoc.service_requests_history[0].delivery_url
												}
												viewBox={`0 0 256 256`}
											/>
										</div>
										<a
											className="text-blue-700 mt-5"
											target="_blank"
											href={
												selectedDoc.service_requests_history[0].delivery_url
											}
											download
											rel="noreferrer"
										>
											Download
										</a>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
