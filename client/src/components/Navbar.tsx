export default function Navbar() {
  function handleClick(){
    localStorage.removeItem('email');
  }
  return (
    <div className="bg-black text-white h-10">
      <div className="w-100 h-[100%] flex justify-center">
        <ul className="flex justify-between w-1/3 h-[100%]  items-center">
          <li className={"hover:text-orange-600"}><a href={"/"}>Home</a></li>
          <li className={"hover:text-orange-600"}><a href={"/watch"}>Watch</a></li>
          <li className={"hover:text-orange-600"}>Price</li>
          <li className={"hover:text-orange-600"}><a href={"/login"}>Profile</a></li>
          <li className={`hover:text-orange-600 ${localStorage.getItem('email') ? "block" : "hidden"}`} onClick={handleClick}>Exit</li>
        </ul>
      </div>
    </div>
  )
}
