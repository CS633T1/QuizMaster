import { Link } from "react-router-dom";

export default function LogIn() {
  return (
    <div>
      <header>
        <h1>Log In</h1>
      </header>
      <Link to={"/"}>Home Page</Link>
      <Link to={"/log-in"}>Log In</Link>
      <Link to={"/sign-up"}>Sign Up</Link>
    </div>
  );
}
