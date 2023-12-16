import React from "react";
import pavanmuri_blank from "src/images/maps/pavanmuri_blank.png";

import { ImageMap } from "@qiuz/react-image-map";

const mapArea = [
	{
		left: "34%",
		top: "20%",
		height: "16%",
		width: "12%",
		onMouseOver: () => console.log("map onMouseOver"),
	},
	{
		left: "6%",
		top: "20%",
		height: "15%",
		width: "8%",
		onMouseOver: () => console.log("map onMouseOver"),
	},
	{
		left: "14%",
		top: "20%",
		height: "15%",
		width: "7%",
		onMouseOver: () => console.log("map onMouseOver"),
	},
	{
		left: "22%",
		top: "29%",
		height: "6%",
		width: "7%",
		onMouseOver: () => console.log("map onMouseOver"),
	},
	{
		left: "28%",
		top: "24%",
		height: "5%",
		width: "6%",
		onMouseOver: () => console.log("map onMouseOver"),
	},
];

const Maps = ({ getDetails }) => {
	const onMapClick = (area, index: number) => {
		const tip = `click map${area.href || index + 1}`;
		console.log(tip);
		const searchNo =
			index === 0
				? 86
				: index === 1
				? 82
				: index === 2
				? 83
				: index === 3
				? 84
				: index === 4
				? 87
				: 86;
		getDetails(searchNo);
	};

	const img =
		"https://n.sinaimg.cn/sinacn20118/408/w690h518/20190701/a126-hzfeken6884504.jpg";

	const ImageMapComponent = React.useMemo(
		() => (
			<ImageMap
				className="usage-map"
				src={pavanmuri_blank}
				map={mapArea}
				onMapClick={onMapClick}
			/>
		),
		[img]
	);
	return (
		<div className="w-[90%] h-[100%]">
			{ImageMapComponent}
			{/* <img src={arjuni_120} alt="logo" className="" /> */}
		</div>
	);
};

export default Maps;
