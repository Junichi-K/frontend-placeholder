import { Navbar } from "./_components/_navbar/Navbar";
import { UserProvider } from "@/context/UserContext"; // ✅ Import UserProvider

const LandingLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <UserProvider>  {/* ✅ Wrap everything inside UserProvider */}
            <div className="h-full">
                <Navbar/>
                <main className="h-full pt-40">
                    {children}
                </main>
            </div>
        </UserProvider>
    );
}

export default LandingLayout;
