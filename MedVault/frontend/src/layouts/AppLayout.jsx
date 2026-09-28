import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Pill, PlusCircle, Menu } from 'lucide-react';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="shell">
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand"><HeartPulse size={26} /><span>MedVault</span></div>
        <nav onClick={() => setOpen(false)}>
          <NavLink to="/dashboard"><LayoutDashboard size={18} />Dashboard</NavLink>
          <NavLink to="/medicines" end><Pill size={18} />Medicines</NavLink>
          <NavLink to="/medicines/add"><PlusCircle size={18} />Add Medicine</NavLink>
        </nav>
        <div className="side-foot">Medical Store Management</div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <span className="crumb">MedVault — Medical Store Management System</span>
          <div className="user"><span>Pharmacist</span><div className="avatar">P</div></div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
