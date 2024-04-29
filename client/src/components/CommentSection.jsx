import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


import { routes } from "../routes"
import { Button, Textarea } from "flowbite-react"
import { useState } from "react"
export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user)
    const [comments, setComment] = useState('')



    const handleSubmit = async (e) => {
        e.preventDefault()
        if(comments.length > 200) return 
        const res = await fetch('/api/comment/create-comment', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({content: comments, postId, userID: currentUser && currentUser._id})
        })
        const data = await res.json()

        if(res.ok){
            setComment('')
        }
    }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
        {
            currentUser ? (
                <div className="flex items-center gap-1 my-5  text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img className="h-5 w-5 object-cover rounded-full " src={currentUser.profilePicture} alt={currentUser.username} />
                    <Link className="text-xs text-cyan-600 hover:underline" to={'/dashboard?tab=profile'}>
                        @{currentUser.username}
                    </Link>
                </div>
            ): (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must be signed in to comment.
                    <Link className="text-blue-500 hover:underline" to={routes.signIn}>Sign In</Link>
                </div>
            )
        }

        {
            currentUser && (
                <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                    <Textarea
                        placeholder="Add comment..."
                        rows={'3'}
                        maxLength={'200'}
                        onChange={e => setComment(e.target.value)}
                        value={comments}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs">{200 - comments.length} characters remaining</p>
                        <Button
                            outline
                            type="submit"
                            gradientDuoTone={'purpleToBlue'}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            )
        }
    </div>
  )
}
