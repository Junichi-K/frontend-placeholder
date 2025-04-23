"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronsLeftRight } from "lucide-react";



export const UserInfo = () => {
    const { user } = useUser();

    console.log(user?.picture);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>         
                <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 flex items-center max-w-[150px]">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={ user?.picture } className="border-2 border-white rounded-full"/>
                        </Avatar>
                        <span className="text-start font-medium line-clamp-1">
                            { user?.name }&apos;s Docs
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2"/>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 bg-[#080808] border border-[#3b2250] rounded-xl shadow-lg" align="start" alignOffset={18}>
                <div className="flex flex-col space-y-4 p-2">
                <p className="text-sm font-medium leading-none text-[#D1D5DB]">
                    {user?.email}
                </p>


                    <div className="flex items-center gap-x-2">
                        <div className="p-1">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={ user?.picture }/>
                            </Avatar>
                        </div>
                        <div>
                            <p className="text-sm line-clamp-1 text-white">
                                { user?.name }&apos;s Docs
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="w-full cursor-pointer text-white transition duration-200 mb-2 px-4 py-2 rounded-md"
                    onSelect={() => { /* log out logic here */ }}
                >
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}