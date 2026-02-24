import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const TABS = ["all", "pending", "accepted", "rejected", "cancelled", "completed"];

export default function Requests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(location.state?.toast || "");
  const [feedbackModal, setFeedbackModal] = useState({ show: false, recipientId: null, recipientName: null });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (!location.state?.toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    navigate(location.pathname, { replace: true, state: {} });
    return () => clearTimeout(timer);
  }, [location.pathname, location.state, navigate]);

  const counts = useMemo(() => {
    const base = { all: requests.length, pending: 0, accepted: 0, rejected: 0, cancelled: 0, completed: 0 };
    requests.forEach((r) => {
      if (base[r.status] !== undefined) base[r.status] += 1;
    });
    return base;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (activeTab === "all") return requests;
    return requests.filter((r) => r.status === activeTab);
  }, [activeTab, requests]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      await loadRequests();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update request.";
      alert(msg);
    }
  };

  const statusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-200 text-gray-700",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-200 text-gray-700";
  };

  return (
    <div className="min-h-screen pt-12 px-8 pb-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-900">
      <div className="max-w-6xl mx-auto">
        {toast && (
          <div className="fixed right-4 top-20 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-lg">
            {toast}
          </div>
        )}

        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Swap Requests</h1>
            <p className="mt-1 text-white/90">Manage your skill swap requests</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/skills")}
            className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition"
          >
            Create New Request
          </button>
        </header>

        <div className="mb-6 flex flex-wrap gap-4 border-b border-white/30">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-400 text-white"
                  : "border-transparent text-white/85 hover:text-white"
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-xl bg-white/90 p-8 text-center shadow-sm">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-xl bg-white/90 p-8 text-center shadow-sm">
            No {activeTab === "all" ? "" : activeTab} requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const isSender = request.sender?._id === user?._id;
              const otherUser = isSender ? request.receiver : request.sender;
              return (
                <article key={request._id} className="rounded-xl border border-gray-200 bg-white/95 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {request.skillOffered} ↔ {request.skillWanted}
                      </h3>
                      <p className="text-gray-600">With {otherUser?.name || "User"}</p>
                    </div>

                    {request.status === "pending" && isSender && (
                      <button
                        type="button"
                        onClick={() => updateStatus(request._id, "cancelled")}
                        className="rounded-lg bg-slate-600 px-4 py-2 text-white font-semibold hover:bg-slate-700 transition"
                      >
                        Cancel Request
                      </button>
                    )}

                    {request.status === "pending" && !isSender && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateStatus(request._id, "accepted")}
                          className="rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(request._id, "rejected")}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(request._id, "completed")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        Mark Complete
                      </button>
                    )}

                    {request.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => setFeedbackModal({ show: true, recipientId: otherUser._id, recipientName: otherUser.name })}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700 transition"
                      >
                        Leave Feedback
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-emerald-50 p-4">
                      <p className="mb-1 text-sm font-semibold text-emerald-900">You&apos;ll Teach</p>
                      <p className="text-xl font-semibold text-emerald-950">{request.skillOffered}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="mb-1 text-sm font-semibold text-blue-900">You&apos;ll Learn</p>
                      <p className="text-xl font-semibold text-blue-950">{request.skillWanted}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <p className="mb-1 text-sm font-semibold text-gray-700">Message:</p>
                    <p className="text-gray-800">{request.message || "No message provided."}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Created {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {feedbackModal.show && (
        <FeedbackModal
          onClose={() => setFeedbackModal({ show: false, recipientId: null, recipientName: null })}
          recipientId={feedbackModal.recipientId}
          recipientName={feedbackModal.recipientName}
          onSubmit={() => {
            setFeedbackModal({ show: false, recipientId: null, recipientName: null });
            setToast("Feedback submitted successfully!");
          }}
        />
      )}
    </div>
  );
}

function FeedbackModal({ onClose, recipientId, recipientName, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/feedback", {
        to: recipientId,
        rating,
        comment: comment.trim(),
      });
      onSubmit();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit feedback.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -left-20 h-60 w-60 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <div
        className="relative w-full max-w-md rounded-2xl border border-white/30 bg-white/95 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 text-xl leading-none"
          aria-label="Close feedback form"
        >
          ×
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">Leave Feedback</h3>
        <p className="text-sm text-gray-600 mb-5">Share your experience with {recipientName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
              Rating (1-5 stars)
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1">1 star - Poor</option>
              <option value="2">2 stars - Fair</option>
              <option value="3">3 stars - Good</option>
              <option value="4">4 stars - Very Good</option>
              <option value="5">5 stars - Excellent</option>
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">
              Comment (optional)
            </label>
            <textarea
              id="comment"
              placeholder="Share your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 text-gray-700 py-2.5 font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-purple-600 text-white py-2.5 font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
