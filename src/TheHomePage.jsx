import { Link } from "react-router-dom";

export default function TheHomePage() {
  return (
    <div>
      <header>
        <h1>Quiz Master</h1>
      </header>
      <Link to={"/"}>Home Page</Link>
      <Link to={"/log-in"}>Log In</Link>
      <Link to={"/sign-up"}>Sign Up</Link>
      <main>
        <input type="text" />
      </main>
    </div>
  );
}
