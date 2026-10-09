import { useState } from "react"
import Inputform from "./Inputform";

const LoginForm = () => {
    const [formData, setformData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const handleChange = (e) =>{
        const {name,value}= e.target;
        setformData({...formData,[name]:value});
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        alert('Form Submitted')

    };


    return(
        <div className=" flex items-center justify-center min-h-screen bg-emerald-300" >
        <form onSubmit={handlesubmit} className="flex flex-col gap-10 items-center justify-center h-[500px] w-[500px]  border-none bg-[#fffffff6] shadow-teal-900 rounded-xl">
<Inputform type='text' placeholder='Enter Name' name='name' value={formData.name} handleChange={handleChange} className='border-[1px]'/>
<Inputform type='email' placeholder='Enter Email' name='email' value={formData.email} handleChange={handleChange}/>
<Inputform type='password' placeholder='Enter Password' name='password' value={formData.password} handleChange={handleChange}/>
<Inputform type='Password' placeholder=' Confirm Password' name='confirmPassword' value={formData.confirmPassword} handleChange={handleChange}/>
<button type="submit" className=" bg-emerald-200 px-12 py-4 rounded transition duration-200 hover:bg-emerald-400">Log in</button>


        </form>
        </div>
    )
};



export default LoginForm;
