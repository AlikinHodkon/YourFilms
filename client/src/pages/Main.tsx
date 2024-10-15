import Navbar from "../components/Navbar.tsx";

function Main() {
    return (
        <div>
            <Navbar />
            <div className="relative flex justify-center items-center bg-black">
                <video className="absolute top-0 left-0 z-10 h-[100%] w-[100%]" autoPlay loop muted>
                    <source src={"public/..."} type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 bg-black opacity-60 z-20 object-cover h-[100%] w-[100%]"></div>
                <div className="text-white text-[50px] z-20 h-[100vh] w-[100%] items-center flex justify-center typewriter">
                    <h1>Welcome, to YourFilms</h1>
                </div>
            </div>
        </div>
    );
}

export default Main;