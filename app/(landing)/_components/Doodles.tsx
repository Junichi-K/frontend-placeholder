import Image from "next/image";

export const Doodles = () => {
    return (
            <div className="items-center flex flex-col justify-center max-w-5xl">
                <div className="flex items-center gap-x-11">
                    <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                        <Image
                            src="/left_landing.png"
                            fill
                            alt="Flying Documents"
                            className="object-contain"
                        />
                    </div>

                    <div className="relative hidden md:block w-[450px] h-[450px]">
                        <Image
                            src="/right_landing.png"
                            fill
                            alt="Rabbit Reading"
                            className="object-contain"
                        />
                    </div>
                </div>
     
            </div> 
    )
}

/*import Image from "next/image";

export const Doodles = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            {/* First Image at 1/3rd Position }
            <div className="absolute left-1/3 -translate-x-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                <Image
                    src="/left_landing.png"
                    fill
                    alt="Flying Documents"
                    className="object-contain"
                />
            </div>

            {/* Second Image at 2/3rd Position }
            <div className="absolute left-2/3 -translate-x-1/2 hidden md:block w-[450px] h-[450px]">
                <Image
                    src="/right_landing.png"
                    fill
                    alt="Rabbit Reading"
                    className="object-contain"
                />
            </div>
        </div>
    );
};
*/