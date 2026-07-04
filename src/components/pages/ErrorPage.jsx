import { useRouteError } from "react-router";

const ErrorPage = () => {
  const err = useRouteError();

  return (
    <div>
      <h1>Opps!!</h1>
      <h2>Something Wents Wrong!</h2>
      <h3>
        {err?.status} : {err?.statusText || err?.message}
      </h3>
    </div>
  );
};

export default ErrorPage;
