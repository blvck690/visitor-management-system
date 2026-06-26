import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, PauseCircle } from "lucide-react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api/public";

export default function ApprovalPage() {
  const { token } = useParams();
  const [sp] = useSearchParams();
  const initial = sp.get("decision");
  const [visit, setVisit] = useState(null);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    axios.get(`${API}/approval/${token}`).then((r) => setVisit(r.data)).catch((e) => setErr(e.response?.data?.error || "Invalid link"));
  }, [token]);

  const decide = async (decision) => {
    try {
      const { data } = await axios.post(`${API}/approval/${token}?decision=${decision}`);
      setDone({ decision, visit: data.visit });
    } catch (e) {
      setErr(e.response?.data?.error || "Failed");
    }
  };

  useEffect(() => { if (initial && visit && !done) decide(initial); /* eslint-disable-next-line */ }, [initial, visit]);

  if (err) return <Center><div className="card max-w-md text-center"><XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" /><h2 className="font-semibold text-lg">{err}</h2></div></Center>;
  if (!visit) return <Center><div className="text-slate-400">Loading...</div></Center>;

  return (
    <Center>
      <div className="card max-w-lg w-full">
        <h1 className="text-xl font-bold">Visitor Request</h1>
        <p className="text-sm text-slate-500 mb-4">Please review and decide.</p>
        <dl className="text-sm divide-y">
          <Row k="Visitor" v={`${visit.visitor.name} (${visit.visitor.company || "—"})`} />
          <Row k="Purpose" v={visit.purpose} />
          <Row k="Date" v={new Date(visit.visitDate).toLocaleDateString()} />
          <Row k="Time" v={`${fmt(visit.startTime)} – ${fmt(visit.endTime)}`} />
          <Row k="Resources" v={visit.bookings.map((b) => b.resource.name).join(", ") || "—"} />
          <Row k="Status" v={visit.status} />
        </dl>

        {done ? (
          <div className="mt-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <div className="font-semibold mt-2">Decision recorded: {done.decision.toUpperCase()}</div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button onClick={() => decide("approve")} className="btn-success"><CheckCircle2 className="w-4 h-4" /> Approve</button>
            <button onClick={() => decide("reject")} className="btn-danger"><XCircle className="w-4 h-4" /> Decline</button>
            <button onClick={() => decide("hold")} className="btn-warn"><PauseCircle className="w-4 h-4" /> Hold</button>
          </div>
        )}
      </div>
    </Center>
  );
}

const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const Row = ({ k, v }) => (
  <div className="py-2 flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-right">{v}</dd></div>
);
const Center = ({ children }) => (
  <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-brand-50 p-6">{children}</div>
);