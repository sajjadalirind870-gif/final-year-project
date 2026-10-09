import Helpcom from "./Helpcom"

const Help = () => {
    return (
        <div className="flex items-center justify-evenly m-10">
            <div>
                <h1 className="text-4xl text-gray-700 font-semibold">Helping Local <br /> <span className="text-[#388E38]">bussiness reinvent itself</span></h1>
                <p className="text-xl text-gray-700">We reached here with our hard work and dedication</p>
            </div>

            <div className="flex gap-x-10 gap-y-28 w-[375px] flex-wrap justify-between px-auto items-center">
             
             <Helpcom src='images/Icon.png' p='223334' h6='Members'/>
             <Helpcom src='images/Icon (1).png' p='102' h6='Club'/>
             <Helpcom src='images/Icon (2).png' p='223334' h6='Members'/>
             <Helpcom src='images/Icon.png' p='223334' h6='Members'/>
            
            </div>

            </div>


    
    )
}


export default Help