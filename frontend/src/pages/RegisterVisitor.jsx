import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

const RESOURCE_LABELS = {
  BOARDROOM: "Boardroom", PROJECTOR: "Projector", HDMI: "HDMI",
  SMART_TV: "Smart TV", WHITEBOARD: "Whiteboard", MEETING_ROOM: "Meeting Room",
};

export default function RegisterVisitor() {
  const nav = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    disability: false, disabilityNote: "",
    purpose: "", hostId: "",
    visitDate: new Date().toISOString().slice(0, 10),
    startTime: "10:00", endTime: "11:00",
    numberOfVisitors: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/admin/employees").then((r) => setEmployees(r.data));
    api.get("/resources").then((r) => setResources(r.data));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const startISO = new Date(`${form.visitDate}T${form.startTime}`).toISOString();
      const endISO = new Date(`${form.visitDate}T${form.endTime}`).toISOString();
      await api.post("/visits/request", {
        visitor: {
          name: form.name, email: form.email, phone: form.phone,
          company: form.company || undefined,
          disability: form.disability,
          disabilityNote: form.disability ? form.disabilityNote : undefined,
        },
        hostId: form.hostId,
        purpose: form.purpose,
        visitDate: new Date(form.visitDate).toISOString(),
        startTime: startISO,
        endTime: endISO,
        numberOfVisitors: Number(form.numberOfVisitors),
        resourceIds: selectedResources,
      });
      toast.success("Visit request sent for approval");
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Register Visitor</h1>
      <p className="text-sm text-slate-500 mb-6">Submit a new visit request. The host will receive an approval email.</p>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        <section className="card md:col-span-2">
          <h2 className="font-semibold mb-4">Visitor Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="label">Visitor Name</label><input required className="input" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><label className="label">Email</label><input required type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div><label className="label">Phone Number</label><input required className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div><label className="label">Company</label><input className="input" value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
            <div className="md:col-span-2">
              <label className="label">Disability</label>
              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2"><input type="radio" checked={!form.disability} onChange={() => set("disability", false)} /> No</label>
                <label className="flex items-center gap-2"><input type="radio" checked={form.disability} onChange={() => set("disability", true)} /> Yes</label>
              </div>
              {form.disability && (
                <textarea className="input mt-3" rows="2" placeholder="Please describe accessibility needs"
                  value={form.disabilityNote} onChange={(e) => set("disabilityNote", e.target.value)} />
              )}
            </div>
          </div>
        </section>

        <section className="card md:col-span-2">
          <h2 className="font-semibold mb-4">Visit Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Purpose of Visit</label>
              <textarea required className="input" rows="2" value={form.purpose} onChange={(e) => set("purpose", e.target.value)} />
            </div>
            <div>
              <label className="label">Employee to Visit</label>
              <select required className="input" value={form.hostId} onChange={(e) => set("hostId", e.target.value)}>
                <option value="">Select employee...</option>
                {employees.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.department}</option>)}
              </select>
            </div>
            <div><label className="label">Visit Date</label><input required type="date" className="input" value={form.visitDate} onChange={(e) => set("visitDate", e.target.value)} /></div>
            <div><label className="label">Start Time</label><input required type="time" className="input" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} /></div>
            <div><label className="label">Expected End Time</label><input required type="time" className="input" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} /></div>
            <div><label className="label">Number of Visitors</label><input required type="number" min="1" className="input" value={form.numberOfVisitors} onChange={(e) => set("numberOfVisitors", e.target.value)} /></div>
          </div>
        </section>

        <section className="card md:col-span-2">
          <h2 className="font-semibold mb-4">Resources Required</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {resources.map((r) => {
              const checked = selectedResources.includes(r.id);
              return (
                <label key={r.id} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${checked ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input type="checkbox" checked={checked} onChange={(e) => {
                    setSelectedResources((s) => e.target.checked ? [...s, r.id] : s.filter((x) => x !== r.id));
                  }} />
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-slate-500">{RESOURCE_LABELS[r.type]} · cap {r.capacity}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <div className="md:col-span-2 flex justify-end">
          <button className="btn-primary" disabled={submitting}><Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Request"}</button>
        </div>
      </form>
    </div>
  );
}