import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, History, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Apply', path: '/apply', icon: Sparkles },
        { name: 'History', path: '/history', icon: History },
        { name: 'Profile', path: '/profile', icon: User },
    ];
    if (!user)
        return null;
    return (<nav className="sticky top-0 z-50 w-full border-b border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-black bg-zinc-900 text-white">
            <Briefcase className="h-5 w-5"/>
          </div>
          <span className="text-lg font-serif font-bold text-zinc-900">
            Smart Apply
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-0 divide-x divide-black">
          {navItems.map((item) => (<Link key={item.path} to={item.path} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors", location.pathname === item.path
                ? "bg-black text-white"
                : "text-zinc-900 hover:bg-black hover:text-white")}>
              <item.icon className="h-4 w-4"/>
              {item.name}
            </Link>))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-black hover:text-white transition-colors">
            <LogOut className="h-4 w-4"/>
            Logout
          </button>
        </div>
      </div>
    </nav>);
};
export default Navbar;
