export async function authenticate(username, email, password, isNewUser) {
    const response = await fetch("http://localhost:5000/api/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password,
            isNewUser
        })
    });
    return response;
}