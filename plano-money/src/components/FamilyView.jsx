import { Trash2, Users } from 'lucide-react'

export default function FamilyView({ t, db, newFamilyMemberName, setNewFamilyMemberName, addFamilyMember, removeFamilyMember }) {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-500" /> {t.addFamilyTitle}
        </h3>
        <form onSubmit={addFamilyMember} className="space-y-4">
          <input
            type="text"
            placeholder={t.familyNamePlaceholder}
            maxLength={60}
            value={newFamilyMemberName}
            onChange={e => setNewFamilyMemberName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base"
          >
            {t.linkFamilyBtn}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {db.familyMembers.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-4">{t.noFamilyMembers}</p>
        )}
        {db.familyMembers.map(m => (
          <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
            <span className="font-bold text-slate-800 text-sm sm:text-base">{m.name}</span>
            <button
              onClick={() => removeFamilyMember(m.id)}
              aria-label="Remove"
              className="text-red-400 hover:text-red-600 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
