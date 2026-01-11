import React from "react";
import { useRouteLoaderData, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { notifyActions } from "../../app/features/notificationSlice";
import { TiArrowForward } from "react-icons/ti";

function formatTimestamp(ts) {
  if (ts == null) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function Notifications() {
  const user = useRouteLoaderData("root");
  const notifications =
    useSelector((state) => state.notify.notifications) || [];
  const dispatch = useDispatch();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const handleReply = (e, n) => {
    e.preventDefault();
    const message = n?.message;
    const [senderName, senderEmail] = message
      .split("\n")[0]
      .split(":")
      .map((s) => s.trim());
    const senderDetails = new URLSearchParams({
      name: senderName,
      email: senderEmail
    }).toString();
    dispatch(notifyActions.removeNotification(n));
    navigate(`/contact?${senderDetails}`);
  };

  return (
    <section className="notifications-page scrollbar-hide">
      <header className="notifications-page__header">
        <div>
          <h1 className="notifications-page__title">Notifications</h1>
          <p className="notifications-page__subtitle">
            {notifications.length
              ? `${notifications.length} item(s)`
              : "All caught up"}
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary notifications-page__clear"
          disabled={notifications.length === 0}
          onClick={() => dispatch(notifyActions.clearNotification())}
        >
          Clear all
        </button>
      </header>

      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <div className="notifications-empty__card">
            No notifications right now.
          </div>
        </div>
      ) : (
        <ul className="notifications-list">
          {notifications.map((n, idx) => (
            <li
              key={n?.id ?? `${n?.head ?? "note"}-${idx}`}
              className={`notifications-card notifications-card--${
                n?.type ?? "info"
              }`}
            >
              <div className="notifications-card__top">
                <div className="notifications-card__meta">
                  <h2 className="notifications-card__head">{n?.head}</h2>
                  {!!formatTimestamp(n?.timestamp) && (
                    <time className="notifications-card__time">
                      {formatTimestamp(n?.timestamp)}
                    </time>
                  )}
                </div>

                <button
                  type="button"
                  className="notifications-card__close"
                  onClick={() => dispatch(notifyActions.removeNotification(n))}
                  aria-label="Remove notification"
                  title="Remove"
                >
                  ×
                </button>
              </div>
              <div className="notifications-card__body">
                <p className="notifications-card__message">{n?.message}</p>
                {isAdmin && n.type === "feedback" && (
                  <button
                    type="button"
                    className="notifications-card__reply"
                    onClick={(e) => handleReply(e, n)}
                  >
                    reply <TiArrowForward />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
