function login() {
    console.log("Test")
    fetch("/login")
      .then((res) => res.json())
      .then((data) => 1 + 1);
}

const Login = () => {
    return (
        <button onClick={login}>
            Login
        </button>
    )
}

export default Login
