import { Button } from "flowbite-react"

import gitImage from '../assets/gitImage.png'


const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col ">
            <h2 className="text-2xl">Would you like to see the github of this project?</h2>
            <p className="text-gray-500 my-2">Checkout these  resources with 100 JavaScript projects</p>
            <Button
                gradientDuoTone={'purpleToPink'}
                className="rounded-tl-xl rounded-bl-none"
            >
                <a 
                target="_blank"
                rel='noopener noreferrer' 
                href="https://github.com/trungduc100803/MERN-BLOG">MERN FullStack Project</a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img src={gitImage} alt="" />
        </div>

    </div>
  )
}


export default CallToAction