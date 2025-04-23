import {useState, useEffect} from "react";

export const ScrollOnTop = (threshold = 10) => {
    const [scrolled, scrolledState] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > threshold) {
                scrolledState(true);
            }

            else {
                scrolledState(false);
            }
        }
        
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
}