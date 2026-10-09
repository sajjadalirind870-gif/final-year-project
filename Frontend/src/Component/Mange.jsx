import Cards from "./Cards";

const Manage = () => {
    return (
        <div className="flex flex-col items-center justify-between my-10 ">
      <div className="text-center ">
          <h1 className="text-6xl text-gray-700 ">Mange your entire community <br /> in a single system</h1>
        <p className="mt-6 text-gray-700 font-normal">Who is ZustaX suitable for?</p>
      </div>
   <div className="flex justify-center items-center flex-wrap gap-20">
    <Cards src='/images/Icon.png' alt='icon' h1='Membership Organisations' p='Our membership management software provides full automation of membership renewals and payment'/>
    <Cards src='/images/Icon (1).png' alt='icon' h1='National Associations' p='Our membership management software provides full automation of membership renewals and payment'/>
    <Cards src='/images/Icon (2).png' alt='icon' h1='Clubs And Group' p='Our membership management software provides full automation of membership renewals and payment'/>
   </div>
        </div>
    )
}

export default Manage;