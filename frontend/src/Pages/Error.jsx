import { useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();
  console.log(err);
  const { data, status, statusText } = err;
  return (
    <>
      <h1>Oops!!</h1>
      <h2>Something went wrong!!</h2>
      <h2>Please check your url</h2>
      <h2>{status}-{statusText}</h2>
      <h2>{data}</h2>
    </>
  );
};

export default Error;