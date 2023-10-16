import Navbar from '../../../components/navbar';
import CommentBox from '../../../components/comments-donnes';

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
                                {/* <h2 className="text-lg text-center font-semibold mb-4">Profile</h2> */}
                                {/* photo nom et infos*/}
                                <div class="flex flex-col mt-10 items-center pb-10">
                                    <img class="w-32 h-32 mb-3 rounded-full shadow-lg ring-4 ring-yellow-400" src="/mylene.jpeg" alt="Mylène" />
                                    <h5 class="mb-1 text-xl font-medium text-gray-900 ">Mylène Dupuy Rosso</h5>
                                    <span class="text-sm text-gray-500 ">Zone Sud-Ouest</span>
                                    <p class=" mt-4 text-gray-800 ">38 gratitudes reçues</p>
                                    <p class=" mt-2 text-gray-800 ">92 tickets restants</p>
                                </div>
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
