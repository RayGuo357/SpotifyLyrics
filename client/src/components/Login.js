function login() {
    fetch("/login", {mode: 'cors'})
      .then((res) => console.log(res))
      .then((data) => console.log(data));
}

function test() {
    fetch("/test")
      .then((res) => console.log(res))
      .then((data) => console.log(data));
}

const Login = () => {
    return (
        <a href={"https://" + window.location.hostname + "/login"}>
            Login
        </a>
    )
}

export default Login