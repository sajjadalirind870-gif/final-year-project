const Helpcom = ({src, alt ,p ,h6}) => {
    return (
        <div className="flex gap-4 ">
            <img src={src} alt={alt}/>
            <div>
                <p className="text-gray-800 font-bold">{p}</p>
                <h6 className="text-gray-800 font-medium">{h6}</h6>
            </div>
        </div>
    )
}

export default Helpcom