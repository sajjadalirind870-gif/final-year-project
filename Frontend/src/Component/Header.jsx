const Header = () => {
    return (
        
        <div className="bg-[#E0E0E0] h-screen flex justify-evenly items-center">
            <div className="space-y-4">
            <h1 className="text-6xl font-semibold text-gray-800 mb-6">Lessons and insights <br />
             <span className="text-[#388E38] ">from 8 years</span></h1>
             <p className="pb-5 text-gray-800 text-xl">  Where to grow your business as a photographer site or social media</p>
             <button className="bg-[#388E38] py-2 px-10 rounded text-white text-xl">Registar</button>


            </div>
            <img src="/images/Illustration.png" alt="Illustration" className="size-98" />
        </div>
    )
}

export default Header