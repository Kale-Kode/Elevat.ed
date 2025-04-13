import { Home, BookOpen, Briefcase, Activity, Bookmark, Users, Settings, LogOut } from "lucide-react";
import { supabase } from "../integrations/supabase/client";

const Sidebar = ({ selected, setSelected, buffer=false }) => {

    const menuItems = [
        { id: "home", label: "Home", icon: <Home size={20} /> },
        { id: "learn", label: "Learn", icon: <BookOpen size={20} /> },
        { id: "project", label: "Project", icon: <Briefcase size={20} /> },
        { id: "cas", label: "CAS", icon: <Activity size={20} /> },
        { id: "trackr", label: "Trackr", icon: <Bookmark size={20} /> },
        { id: "mentors", label: "Mentors", icon: <Users size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error){
        console.log('error signing out: ', error)
        }
    }

    return (
        <div className={`col-span-1 bg-white h-fit flex flex-col items-spread gap-4 py-8 rounded-2xl sticky top-0`}>
            <div className="flex gap-2 items-center justify-center px-4 mb-12">
                <img className="w-8" src='/elevated_logo.png' alt='logo'></img>
                <p className="text-2xl font-bold text-green-full">Elevat.ed</p>
            </div>

            <nav className="flex flex-col">
                {menuItems.map((item) => (
                <div
                    key={item.id}
                    className={`flex items-center gap-3 w-full pl-8 p-3 cursor-pointer hover:bg-blue-light transition-all ${
                    selected === item.id ? "bg-blue-light text-blue-full border-l-4 border-blue-full" : "text-gray-600"
                    }`}
                    onClick={() => setSelected(item.id)}>
                    {item.icon}
                    <p>{item.label}</p>
                </div>
                ))}
            </nav>

            {/* <div className="flex items-center gap-3 p-3 pl-8 rounded-lg cursor-pointer text-red-500 hover:bg-red-100 mt-auto"
                onClick={signOut}>
                <LogOut size={20} />
                <span>Sign Out</span>
            </div> */}

        </div>
    );
}

export default Sidebar
