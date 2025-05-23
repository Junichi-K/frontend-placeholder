import { Doodles } from "./_components/Doodles";
import { Footer } from "./_components/Footer";
import {Heading} from "./_components/Heading";

const LandingPage = () => {
    return (
        <div className = "min-h-full flex flex-col">
            <div className = "flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <Heading/>
                <Doodles/>
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage; 