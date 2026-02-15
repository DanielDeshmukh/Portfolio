import React, {useState, useEffect} from 'react'

export default function AdminPanel({profile, onClose, onSave}){
  const [bio, setBio] = useState('')
  useEffect(()=>{ if(profile) setBio(profile.bio || '') },[profile])

  function save(){
    const updated = {...profile, bio}
    onSave && onSave(updated)
    alert('Saved to localStorage')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-secondary w-full md:w-2/3 lg:w-1/2 rounded-t-lg md:rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg">Admin Panel</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-accent rounded hover:border-primary transition text-sm" onClick={onClose}>Close</button>
            <button className="px-3 py-1 bg-primary text-black rounded border border-primary hover:opacity-90 transition text-sm" onClick={save}>Save</button>
          </div>
        </div>
        <div>
          <label className="text-xs">Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} className="mt-2 w-full h-32 p-2 bg-background rounded border border-gray-700 focus:border-primary transition" />
        </div>
      </div>
    </div>
  )
}
