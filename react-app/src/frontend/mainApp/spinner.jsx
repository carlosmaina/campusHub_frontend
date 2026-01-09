import "../mainCss/overlays_css/spinner.css";
function Spinner() {
	return (
		<div className="all-set">
			<div className="rotater">
				<div className="dots first"></div>
				<div className="dots second"></div>
				<div className="dots third"></div>
			</div>
			<p>Login out...</p>
		</div>
	);
}
export default Spinner;
