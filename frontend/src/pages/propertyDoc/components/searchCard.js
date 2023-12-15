import React from "react";

const SearchCard = ({ data }) => {
	return (
		<div>
			<div
				className={`card ${
					data?.request_status === "Delivered"
						? "bg-green-50 text-white"
						: "bg-yellow-50 text-black"
				}
      bg-white flex flex-col justify-between p-2 border border-gray-300 rounded-2xl transition-shadow duration-200 relative`}
			>
				<div>
					<h5 className="card-title text-m font-bold text-gray-900 top-5 left-5">
						{data.village.village_text_en}
					</h5>
				</div>

				<div className="content">
					<p className="card-description text-base text-slate-600 mb-4">
						<span className="text-sm">Search number:</span>{" "}
						{data?.search_number}
					</p>
				</div>
				<div
					className={`rounded-full px-3 py-1 text-sm text-center ${
						data?.request_status === "Delivered"
							? "bg-green-500 text-white"
							: "bg-yellow-500 text-black"
					}`}
				>
					{data?.request_status}
				</div>
			</div>
		</div>
	);
};

export default SearchCard;
