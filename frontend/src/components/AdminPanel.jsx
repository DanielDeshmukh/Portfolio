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
      <div className="relative bg-secondary w-full md:w-2/3 lg:w-1/2 rounded-t-lg md:rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg">Admin Panel</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-accent rounded hover:border-primary transition" onClick={onClose}>Close</button>
            <button className="px-3 py-1 bg-primary text-black rounded border border-primary hover:opacity-90 transition" onClick={save}>Save</button>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm">Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} className="mt-2 w-full h-40 p-3 bg-background rounded border border-gray-700 focus:border-primary transition" />
        </div>
      </div>
    </div>
  )
}
