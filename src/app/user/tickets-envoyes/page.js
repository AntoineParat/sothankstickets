"use client"
import Navbar from '../../../components/navbar';
import CommentBox from '../../../components/comments-donnes';
import UserBox from '@/components/user/userBox';



export default function Ticketsrecus() {
    return (
        <div>
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                {/* Main Content */}
                <div className="container sm:mx-10 md:mx-auto mt-10">
                    {/* Sidebar & Main content */}
                    <div className="md:flex">
                        {/* Sidebar */}
                        <div className="md:w-1/4">
                            <div className="bg-white p-4 shadow mb-4">
                                <UserBox/>
                            </div>

                        </div>

                        {/* Main content */}
                        <div className="md:w-3/4 md:ml-4 flex-col">
                            {/*feeds news*/}
                            <CommentBox />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
