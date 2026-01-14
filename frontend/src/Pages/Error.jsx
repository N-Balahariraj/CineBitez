import { useRouteError } from "react-router-dom";

const Error = () => {
  const err = useRouteError();

  const status = err?.status ?? err?.statusCode ?? "";
  const statusText = err?.statusText ?? err?.message ?? "Something went wrong";
  const data =
    err?.data ??
    (typeof err === "string" ? err : "") ??
    "";

  return (
    <section className="app-page-center">
      <div className="app-card">
        <h1 className="app-card__title">Oops!!</h1>
        <p className="app-card__subtitle">Something went wrong!!</p>

        <div className="app-card__meta">
          <div>
            {status ? `${status} - ` : ""}
            {statusText}
          </div>
          {data ? (
            <pre className="app-card__pre">
              {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Error;