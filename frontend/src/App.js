import React, { createContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { TOKEN_TYPE } from "src/utils/constants";
import { getUrl, request } from "src/utils/networkUtils";

import RequireAuth from "./routes/RequireAuth";
import Auth from "./pages/auth";
import { PropertyApp } from "./pages/propertydocs";
import { ModalProvider } from "./contexts/ModalContext"; // Adjust the path
import Bhume from "./pages/bhume";
import { PropertyDoc } from "./pages/propertyDoc";
import { PropertyOnMap } from "./pages/propertyOnMap";

export const AppContext = createContext({});

const App = () => {
	const [user, setUser] = useState("");
	const [header, setHeader] = useState("All Workspace");

	let navigate = useNavigate();

	const logout = () => {
		const url = getUrl("v1/auth/logout/");
		return request("POST", url, null, true);
	};

	const { mutate: logOut, isLoading: logoutLoading } = useMutation(logout, {
		onSuccess: () => {
			localStorage.removeItem(TOKEN_TYPE);
			navigate("/auth/login");
		},
		onError: (err) => console.log(err),
	});

	return (
		<ModalProvider>
			<AppContext.Provider
				value={{
					logOut,
					logoutLoading,
					user,
					setUser,
					header,
					setHeader,
				}}
			>
				<Routes>
					<Route path="/auth/*" element={<Auth />} />
					<Route
						exact
						path="/"
						element={
							<RequireAuth redirectTo="/auth" layout={false}>
								<Bhume />
							</RequireAuth>
						}
					/>
					<Route
						exact
						path="/propertydocs"
						element={
							<RequireAuth redirectTo="/auth" layout={false}>
								<PropertyApp />
							</RequireAuth>
						}
					/>
					<Route
						exact
						path="/property-doc-v2"
						element={
							<RequireAuth redirectTo="/auth" layout={false}>
								<PropertyDoc />
							</RequireAuth>
						}
					/>
					<Route
						exact
						path="/landglide"
						element={
							<RequireAuth redirectTo="/auth" layout={false}>
								<PropertyOnMap />
							</RequireAuth>
						}
					/>
				</Routes>
			</AppContext.Provider>
		</ModalProvider>
	);
};

export default App;
