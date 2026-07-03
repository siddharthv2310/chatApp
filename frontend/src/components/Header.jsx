
function Header({username, activeRoom,socketId}) {

    return (

        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">

            <div>

                <h1 className="text-2xl font-bold">

                    💬 What_Chat

                </h1>

                <p className="text-green-300 mt-2">

                    User :

                    <span className="font-semibold ml-1">

                        {username}

                    </span>

                </p>

                <p className="text-blue-100">

                    Active Room :

                    <span className="font-semibold ml-1">

                        {activeRoom || "None"}

                    </span>

                </p>

            </div>

            <div className="text-right">

                <p className="uppercase text-xs">

                    Socket ID

                </p>

                <p className="font-mono text-sm">

                    {socketId}

                </p>

            </div>

        </div>

    );

}

export default Header;