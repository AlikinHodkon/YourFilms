export default function Navbar() {
  return (
    <div className="bg-black text-white h-10">
      <div className="w-100 h-[100%] flex justify-center">
        <ul className="flex justify-between w-1/3 h-[100%]  items-center">
          <li className={" hover:text-cyan-500"}><a href={"/"}>Home</a></li>
          <li className={" hover:text-cyan-500"}><a href={"/watch"}>Watch</a></li>
          <li className={" hover:text-cyan-500"}>Price</li>
          <li className={" hover:text-cyan-500"}><a href={"/profile"}>Profile</a></li>
        </ul>
      </div>
    </div>
  )
}
