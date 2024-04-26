import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"

import { BsFacebook, BsInstagram, BsGithub } from 'react-icons/bs'

const FooterCom = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="w-full grid justify-between sm:flex md:grid-cols-1">
                    <div className="mb-5 ">
                        <Link to={'/'} className="self-center whitespace-nowrap text-sm sm:text-xl dark:text-white font-semibold">
                            <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">TD's</span>
                            Blog
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3">

                        <div className="">
                            <Footer.Title title="ABOUT" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>

                        <div className="">
                            <Footer.Title title="FOLLOW US" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>

                            </Footer.LinkGroup>
                        </div>

                        <div className="">
                            <Footer.Title title="LEGAL" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Term & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="TD's Blog" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterCom
