const Client = () => {
    return(
        <div className="flex flex-col justify-center items-center gap-8 my-24 text-center" >
            <div>
                <h1 className="text-6xl font-semibold text-gray-700 mb-4">Our Clients</h1>
                <p className="text-xl text-gray-700 font-normal">We have been working with some fortune 500+ clients</p>
            </div>
            <img src="/images/Clients Logos.png" alt="" className="w-250" />
        </div>
    )
}

export default Client