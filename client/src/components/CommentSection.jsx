import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"


import { routes } from "../routes"
import { Alert, Button, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import Comment from "./Comment"

export default function CommentSection({postId}) {
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.user)
    const [comments, setComment] = useState('')
    const [commentErr, setCommentErr] = useState(null)
    const [listComment, setListComment] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(comments.length > 200) return 
        try {
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
                setCommentErr(null)
                setListComment([data.comment, ...listComment])
            }
        } catch (error) {
            setCommentErr(error.message)
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/get-post-comment/${postId}`)
                if(res.ok){
                    const data = await res.json()
                    setListComment(data.comments)
                }
                
            } catch (error) {
                console.log(error.message)
            }
        }
        getComments()
    }, [postId])

    const handleLikeComment = async (commentId) => {
        try {
            if(!currentUser){
                navigate(routes.signIn)
                return 
            }

            const res = await fetch(`/api/comment/like-comment/${commentId}`, {
                method: "PUT"
            })
            if(res.ok){
                const data = await res.json()
                setListComment(
                    listComment.map(cmt => 
                        cmt._id === commentId ?
                        {
                            ...cmt,
                            likes: data.comment.likes,
                            numberOfLikes: data.comment.likes.length
                        } :
                        cmt
                    )
                )
            }
        } catch (error) {
            
        }
    }

    const handleEdit = async (comment, editedComment) => {
        setListComment(
            listComment.map(cmt => 
                cmt._id === comment._id ? {...cmt, content: editedComment} : cmt
            )
        )
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

                    {
                        commentErr && (
                            <Alert color={'failure'}>{commentErr}</Alert>
                        )
                    }
                </form>
            )
        }

        {
            listComment.length === 0 ? (
                <div className="text-sm my-5">No comments yet!!</div>
            ) : (
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{listComment.length}</p>
                        </div>
                    </div>
                    {
                        listComment.map(comment => (
                            <Comment onEdit={handleEdit} key={comment._id} comment={comment} onLikeComment={handleLikeComment}/>
                        ))
                    }
                </>
            )
        }
    </div>
  )
}
