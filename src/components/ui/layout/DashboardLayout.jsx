import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">DevTrack</h1>

        <nav className="space-y-4">
          <Link to="/dashboard" className="block text-lg hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/projects" className="block text-lg hover:text-blue-600">
            Projects
          </Link>
          <Link to="/tasks" className="block text-lg hover:text-blue-600">
            Tasks
          </Link>
        </nav>

        <div className="mt-auto">
          <Button className="w-full mt-6">Logout</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold">Welcome back 👋</h2>

          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50">
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50">
                Settings
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
