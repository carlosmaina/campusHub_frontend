import localCSS from "../mainCss/local.module.css";
function Locally({ toggle }) {
  return (
    <div className={`${toggle === "Locally" ? "" : localCSS.activeScreen}`}>
      <h1>Coming soon</h1>
    </div>
  );
}
export default Locally;
