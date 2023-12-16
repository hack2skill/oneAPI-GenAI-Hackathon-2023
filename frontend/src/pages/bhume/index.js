import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Bhume = () => {
	let navigate = useNavigate();

	return (
		<div className="flex h-screen justify-center items-center gap-4 ">
			<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div>
					<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Raise Request
					</h5>
				</div>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Simplify your property documentation needs. Download property cards,
					Index 2 documents, and more hassle-free with our expert online
					service.
				</p>
				<Button type="primary" onClick={() => navigate("/propertydocs")}>
					Continue to app
				</Button>
			</div>
			{/* <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div>
					<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						View Your Document
					</h5>
				</div>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Simplify your property documentation needs. Download property cards,
					Index 2 documents, and more hassle-free with our expert online
					service.
				</p>
				<Button type="primary" onClick={() => navigate("/property-doc-v2")}>
					Continue to app
				</Button>
			</div> */}
			<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div>
					<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Landglide
					</h5>
				</div>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					Simplify your property documentation needs. Download property cards,
					Index 2 documents, and more hassle-free with our expert online
					service.
				</p>
				<Button type="primary" onClick={() => navigate("/landglide")}>
					Continue to app
				</Button>
			</div>
		</div>
	);
};

export default Bhume;
