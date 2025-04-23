"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className = "max-w-3xl space-y-4">
            <h1 className = "text-3xl sm:text-5xl md:text-6xl text-gray-200 font-medium">
                Organize your thoughts with  <span className = "underline">ExpenPad</span>
            </h1>
            <h3 className = "text-base text-gray-200 sm:text-xl md: text-2xl font-medium">
                Write quick and easy to understand notes for your studies, <br/>
                work or even your kitchen recipes!!
            </h3>
            <Button variant="secondary">
                Get Started
                <ArrowRight className = "h-4 w-9 ml-2"/>
            </Button>
        </div>
    )
}

