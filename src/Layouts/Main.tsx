import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/ui/Navbar";
import { useState, type ReactNode } from "react";

interface MainProps {
children: ReactNode;
}

const Main = ({ children }: MainProps) => {
const [slideOpen, setSlideOpen] = useState(false);

const handleSlidein = () => {
setSlideOpen((state) => !state);
};

const handleCloseSidebar = () => {
setSlideOpen(false);
};

return ( <div className="min-h-screen bg-gray-50"> <Navbar handleSlidein={handleSlidein} />


  <div className="flex w-full">
    <Sidebar
      isOpen={slideOpen}
      onClose={handleCloseSidebar}
    />

    <main className="min-w-0 flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      {children}
    </main>
   
  </div>
</div>


);
};

export default Main;
