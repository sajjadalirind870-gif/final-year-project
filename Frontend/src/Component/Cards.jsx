const Cards = ({src, alt, h1,p}) => {
    return (
        <div className="w-60 flex flex-col items-center text-center space-y-5 m-9">
            
           <img src={src} alt={alt}  className="w-20"/>
           <h1 className="text-4xl text-gray-700  font-semibold">
           {h1}
           </h1> 
           <p className="text-base font-normal text-gray-700">{p}</p>
        </div>
    )
};

export default Cards