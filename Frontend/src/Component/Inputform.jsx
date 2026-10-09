
const Inputform = ({name, value, handleChange, type, placeholder}) => {
    return (
        
        <input type={type} value={value} placeholder={placeholder} onChange={handleChange} name={name}  className="border-b-[1px] w-90 rounded h-10 px-4" />
    )
}

export default Inputform;