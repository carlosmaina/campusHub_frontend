function ErrorPage() {
    let style = {
        cont: {
            display: "flex",
            color: "#fff",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center"
        },
        error: {
            color: "red"
        }
    }
    return (
        <div style={style.cont}>
            <h1><span style={style.error}>404{" "}</span>Page Not Found</h1>
        </div>
    )
}
export default ErrorPage