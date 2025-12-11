import spin from "../mainCss/uploadSpin.module.css";
function Spin({ errorC }) {
	return (
		<div className={spin.spin}>
			{errorC ? (
				<p style={{ color: "red", fontWeight: "bold" }}>{errorC}</p>
			) : (
				<div className={spin.spin}>
					<div className={spin.rotate}></div>
					<p className={spin.wheel}>Generating summary...</p>
				</div>
			)}
		</div>
	);
}
export default Spin;
