import React, {useState} from 'react'

export default function AdminGate({onEnable}){
  const [open,setOpen] = useState(false)
  const [key, setKey] = useState('')
  const SECRET = '2503'

  function submit(){
    if(key === SECRET){
      onEnable && onEnable()
      setOpen(false)
      setKey('')
    } else {
      alert('Invalid key')
    }
  }

  return (
    <>
      <button aria-label="admin" onClick={()=>setOpen(true)} className="fixed right-6 bottom-6 bg-primary text-black p-3 rounded-full shadow-lg z-50 border border-primary hover:opacity-90 transition"><i className="fas fa-user-shield"></i></button>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-secondary rounded p-6 w-80 border border-gray-700">
            <h3 className="font-heading text-lg">Admin</h3>
            <p className="text-sm mt-2 text-gray-200">Enter secret key to enable edit mode.</p>
            <input value={key} onChange={e=>setKey(e.target.value)} className="mt-3 w-full px-3 py-2 bg-background rounded border border-gray-700 focus:border-primary transition text-sm" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-1 border border-accent rounded hover:border-primary transition text-sm">Cancel</button>
              <button onClick={submit} className="px-3 py-1 bg-primary text-black rounded border border-primary hover:opacity-90 transition text-sm">Unlock</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
