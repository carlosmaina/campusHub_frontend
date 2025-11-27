import spin from "../mainCss/uploadSpin.module.css";
function Spin({ errorC }) {
	return (
		<div className={spin.spin}>
			{errorC ? (
				<p style={{ color: "red", fontWeight: "bold" }}>{errorC}</p>
			) : (
				<p className={spin.wheel}>Generating summary...</p>
			)}
		</div>
	);
}
export default Spin;
