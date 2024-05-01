import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

export default function Search() {
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl
            })
        }
        const fetchPosts = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/post/getpost?${searchQuery}`)

            if(!res.ok){
                setLoading(false)
                return 
            }

            if(res.ok){
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)
                if(data.posts.length === 9){
                    setShowMore(true)
                }else{
                    setShowMore(false)
                }
            }
        }
        fetchPosts()
    }, [location.search])

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc'
            setSidebarData({
                ...sidebarData,
                sort: order
            })
        }
        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategorized'
            setSidebarData({...sidebarData, category})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    console.log(posts)
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b md:border-r  md:min-h-screen border-gray-500">
            <form action="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 mb-4">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput
                        placeholder='Search...'
                        id='searchTerm'
                        type='text'
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <label className='font-semibold'>Sort:</label>
                    <Select
                        onChange={handleChange}
                        id='sort'
                        value={sidebarData.sort}
                    >
                        <option value="desc">Latest</option>
                        <option value="asc">Oldest</option>
                    </Select>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <label className='font-semibold'>Category:</label>
                    <Select
                        onChange={handleChange}
                        id='category'
                        value={sidebarData.category}
                    >
                        <option value="uncategorized">Uncategorized</option>
                        <option value="reactjs">React JS</option>
                        <option value="nextjs">Next JS</option>
                        <option value="javascript">JavaScript</option>
                    </Select>
                </div>

                <Button
                    type='submit'
                    gradientDuoTone='purpleToPink'
                    outline
                >
                    Apply Fillters
                </Button>
            </form>
        </div>

        <div className="w-full">
            <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Posts results:</h1>
            <div className="p-7 flex  flex-wrap gap-4">
                {
                    !loading && posts.length === 0 && (
                        <p className="text-xl text-gray-500">No posts found</p>
                    )
                }
                {
                    loading && (
                        <p className="text-xl text-gray-500">Loading...</p>
                    )
                }

                {
                    posts && posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))
                }
            </div>
        </div>
    </div>
  )
}
