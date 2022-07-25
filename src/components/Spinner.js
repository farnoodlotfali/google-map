import { Loader } from "react-feather"


const Spinner = () => {
  return (
    <div className="absolute bg-black opacity-60 w-full h-full z-10 flex justify-center items-center">
        <Loader className="animate-spin  text-white" size={50} />
    </div>
  )
}

export default Spinner