let user = JSON.parse(sessionStorage.getItem("user")) || [];
function user_data(d) {
	user.push({ d });
	sessionStorage.setItem("user", JSON.stringify(user));
}
