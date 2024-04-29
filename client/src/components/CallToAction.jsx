import { Button } from "flowbite-react"

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col ">
            <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
            <p className="text-gray-500 my-2">Checkout these  resources with 100 JavaScript projects</p>
            <Button
                gradientDuoTone={'purpleToPink'}
                className="rounded-tl-xl rounded-bl-none"
            >
                <a 
                target="_blank"
                rel='noopener noreferrer' 
                href="">100 JavaScript projects</a>
            </Button>
        </div>
        <div className="p-7">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEqfkhWk2H8NE-voUTtOKjVWHsHAKryTL0hrlDJV2HrBIZlcGrjF3PYBYgTrjOROot3p0&usqp=CAU" alt="" />
        </div>

    </div>
  )
}


export default CallToAction