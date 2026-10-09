const Navbar = () => {
    return (
        <nav className="flex justify-evenly items-center px-4 py-6 h-[100px] bg-[#ffffff] ">
          <h1 className="text-3xl text-[#388E38] font-bold mr-40 "> ZustaX</h1>
          <div className ="flex gap-8 ">
            <a href="http://" className="text-xl mt-3">Home</a>
            <a href="http://" className="text-xl mt-3">Features</a>
            <a href="http://" className="text-xl mt-3">Community</a>
            <a href="http://" className="text-xl mt-3">Blog</a>
            <a href="http://" className="text-xl mt-3">Pricing</a>
            <button className="bg-[#388E38] text-white text-xl px-6 py-3 rounded">Registar Now</button>
          </div>
        </nav>
    )
}
export default Navbar;