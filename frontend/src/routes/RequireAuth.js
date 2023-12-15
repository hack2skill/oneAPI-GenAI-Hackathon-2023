import React from "react";
import { Navigate } from "react-router-dom";

import { TOKEN_TYPE } from "src/utils/constants";

import { Layout } from "../components/layout";

export default function RequireAuth({ children, redirectTo, layout = true }) {
	const authToken = localStorage.getItem(TOKEN_TYPE);
	let isAuthenticated = false;
	if (authToken) isAuthenticated = true;
	return isAuthenticated ? (
		layout ? (
			<Layout>{children}</Layout>
		) : (
			<>{children}</>
		)
	) : (
		<Navigate to={redirectTo} />
	);
}
