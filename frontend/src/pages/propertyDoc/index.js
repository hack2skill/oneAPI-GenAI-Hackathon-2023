import axios from "axios";
import SearchCard from "./components/searchCard";
import logo from "src/images/logo.png";

import React, { useEffect, useState } from "react";
import Maps from "./components/map";
import { useNavigate } from "react-router-dom";

// The main component for the webapp
export const PropertyDoc = () => {
	let navigate = useNavigate();
	// const { logOut } = useContext(AppContext);
	const storedUserData = JSON.parse(localStorage.getItem("userData"));
	// If there is any user data, check if the access token is expired

	const [docDetails, setDocDetails] = useState();
	const [selectedDoc, setSelectedDoc] = useState(null);
	const [selectedOwnerDetails, setSelectedOwnerDetails] = useState(null);

	useEffect(() => {
		getData();
	}, []);

	function getData() {
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
					page: 1,
				},
				{ headers }
			)
			.then((response) => {
				setDocDetails(response?.data?.result?.data);
				// If successful, set the phone number and otp sent state
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const getDetails = (item) => {
		setSelectedDoc(item);
		if (
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
					<div className="flex h-screen">
						<div className="bg-[#C6C6C63D] w-1/5 p-5">
							<div className="text-lg font-bold border-b-2 border-blue-300 mb-5">
								Documents
							</div>
							<div className="h-[80vh] overflow-scroll">
								{docDetails &&
									docDetails.map((item, index) => (
										<div
											key={index}
											className="text-l font-bold my-2 text-blue-500 cursor-pointer"
											onClick={() => getDetails(item)}
										>
											<SearchCard data={item} />
										</div>
									))}
							</div>
						</div>
						<div className="flex flex-col justify-between w-4/5 h-[90vh]">
							{/* <div className="flex flex-col justify-between w-4/5 h-[90vh] bg-no-repeat bg-cover bg-center bg-[url('/src/images/map_bg.png')]"> */}
							<div className="flex justify-center items-center h-[50vh] text-white w-full">
								<div className="flex justify-center items-center">
									{selectedDoc && <Maps />}
								</div>
							</div>
							<div className="bg-[#fff] p-5">
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
														<th>Barren</th>
														<th>Number of mutation</th>
													</tr>
												</thead>
												<tbody>
													{selectedOwnerDetails &&
														selectedOwnerDetails.map((owner, index) => (
															<tr key={index}>
																<td>{owner["Account Number"]}</td>
																<td>{owner["Occupier Name"]}</td>
																<td>{owner["Area"]}</td>
																<td>{owner["Land Revenue"]}</td>
																<td>{owner["Barren"]}</td>
																<td>{owner["Number of mutation"]}</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
