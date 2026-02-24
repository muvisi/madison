"use client";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-900">Members</h1>
      <p className="text-blue-800/70">Manage all members in your Madison group here.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3,4,5].map((m) => (
          <div key={m} className="p-4 bg-blue-100/50 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="font-semibold text-blue-900">Member {m}</h3>
            <p className="text-blue-800/60">Some member info</p>
          </div>
        ))}
      </div>
    </div>
  );
}