import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'


import PostCard from '../components/PostCard'
import { routes } from '../routes'
import CallToAction from '../components/CallToAction'

const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/post/getpost')
            if(res.ok){
                const data = await res.json()
                setPosts(data.posts)
            }
        }
        fetchPosts()
    }, [])

    return (
        <div>
            <div className="flex flex-col gap-6 p-28 max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium laboriosam quas magnam ea facere, eaque nihil esse voluptatum error deleniti voluptates delectus adipisci praesentium quidem officiis optio dolorem, nesciunt vel?</p>
                <Link
                    to={routes.search}
                    className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
                >
                    View all posts
                </Link>
            </div>

            <div className="p-3 bg-amber-100 dark:bg-slate-700">
                <CallToAction/>
            </div>

            <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
                {
                    posts && posts.length > 0 && (
                        <div className="">
                            <h2 className="text-2xl font-semibold text-center mb-8">Recent Posts</h2>
                            <div className="flex flex-wrap gap-16 justify-center">
                                {
                                    posts.map(post => (
                                        <PostCard key={post._id} post={post} />
                                    ))
                                }
                            </div>
                            <div className="flex justify-center mt-10">

                            <Link
                                to={routes.search}
                                className=' text-lg text-teal-500 hover:underline '
                            >
                                View all posts 
                            </Link>

                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home
