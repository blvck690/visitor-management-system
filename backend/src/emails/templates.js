export const approvalEmail = ({ host, visitor, visit, approveUrl, rejectUrl, holdUrl }) => {
  const date = new Date(visit.visitDate).toLocaleDateString();
  const start = new Date(visit.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const end = new Date(visit.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return {
    subject: `Visitor request: ${visitor.name} — ${visit.purpose}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 8px">New visitor request</h2>
        <p style="color:#555;margin:0 0 16px">Hi ${host.name}, a new visit needs your decision.</p>
        <table style="width:100%;font-size:14px;color:#222">
          <tr><td><b>Visitor</b></td><td>${visitor.name} (${visitor.company ?? "—"})</td></tr>
          <tr><td><b>Purpose</b></td><td>${visit.purpose}</td></tr>
          <tr><td><b>Date</b></td><td>${date}</td></tr>
          <tr><td><b>Time</b></td><td>${start} – ${end}</td></tr>
          <tr><td><b>Party size</b></td><td>${visit.numberOfVisitors}</td></tr>
        </table>
        <div style="margin-top:24px;display:flex;gap:8px">
          <a href="${approveUrl}" style="background:#16a34a;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Approve</a>
          <a href="${rejectUrl}" style="background:#dc2626;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Decline</a>
          <a href="${holdUrl}" style="background:#f59e0b;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Hold</a>
        </div>
        <p style="color:#888;font-size:12px;margin-top:24px">Visitor Management System</p>
      </div>`,
  };
};