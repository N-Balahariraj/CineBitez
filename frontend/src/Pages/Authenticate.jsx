import { authenticate } from "../Apis/authenticate";

export default function Authenticate() {
  const isNewUser = false;
  async function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const response = await authenticate(username, email, password, isNewUser);
    const userData = await response.json();
    console.log(userData);
  }
  return (
    <form onSubmit={handleSubmit} className="authenticate">
      <h1 className=" col-span-2 place-self-center font-bold text-[1.5rem]">
        {isNewUser ? "Register" : "Login"}
      </h1>
      <label htmlFor="username">Full Name :</label>
      <input
        type="text"
        name="username"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <label htmlFor="email">Email :</label>
      <input
        type="email"
        name="email"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <label htmlFor="password">Password :</label>
      <input
        type="password"
        name="password"
        className=" w-[100%] h-[30px] m-2 rounded-md outline-none text-black px-2"
      />
      <button type="submit" className="authenticate__btn-submit">Login</button>
    </form>
  );
}
