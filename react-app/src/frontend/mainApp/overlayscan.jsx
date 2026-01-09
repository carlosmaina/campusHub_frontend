import { useState } from "react";
import lay from "../mainCss/overlays_css/overlayscan.module.css";
function SearchView({ view, error }) {
	let [res] = useState(`searching...`);
	return (
		<div className={`${lay.show} ${view ? lay.content : ""}`}>
			{error ? (
				<p className={lay.errMess}>{error}</p>
			) : (
				<p className={lay.react}>{res}</p>
			)}
		</div>
	);
}
export default SearchView;
