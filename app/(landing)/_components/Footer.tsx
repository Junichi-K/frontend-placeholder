import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-[#000000] text-white z-50 mx-auto max-w-7xl">
            <Logo/>

            <div className="md:ml-auto w-full justify-between md:justify-end flex text-[#cecece]">
                <Button variant="ghost">
                    Terms and Conditions
                </Button>

                {/* <Button>
                    Privacy Policy
                </Button> */}
            </div>
        </div>
    )
}