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
        <a href={"http://" + window.location.hostname + ":3001/login"}>
            Login
        </a>
    )
}

export default Login