import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {Button, Textarea} from 'flowbite-react'

export default function Comment({comment, onLikeComment, onEdit, onDelete}) {

    const [user, setUser] = useState({})
    const [isEditing, setisEditing] = useState(false)
    const [editedComment, setEditedComment] = useState(comment.content)
    const {currentUser} = useSelector(state => state.user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userID}`)
                if(res.ok){
                    const data = await res.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser()
    }, [comment])

    const handleEditComment = async () => {
        setisEditing(true)
        setEditedComment(comment.content)
    }

    const handleSaveComment = async () => {
        try {
            const res  = await fetch(`/api/comment/edit-comment/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: editedComment
                })
            })

            if(res.ok){
                setisEditing(false)
                onEdit(comment, editedComment)
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className="flex-shrink-0 mr-3 ">
            <img 
                src={user.profilePicture}
                alt={user.username}
                className='w-10 h-10 rounded-full bg-gray-200'
            />
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className='font-bold mr-1 text-xs truncate '>{user ? `@${user.username}` : 'anonymous user'}</span>
                <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
            </div>
            {
                isEditing ? (
                    <>
                        <Textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className='mb-2'
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSaveComment}
                            >
                                Save
                            </Button>

                            <Button
                                outline
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={() => setisEditing(false)}
                            >
                                Cancel
                            </Button>

                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                            <button
                                type='button' 
                                className={`text-gray-400 hover:text-blue-500 ${
                                    currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                                }`}
                                onClick={() => onLikeComment(comment._id)}
                            >
                                <FaThumbsUp className='text-sm'/>
                            </button>
                            <p className="text-gary-400">
                                {
                                    comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : "likes") 
                                }
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userID || currentUser.isAdmin) && (
                                    <>
                                    
                                            <button
                                                type='button'
                                                onClick={handleEditComment}
                                                className='text-gray-400 hover:text-blue-500'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onDelete(comment._id)}
                                                className='text-gray-400 hover:text-red-500'
                                            >
                                                Delete
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    </div>
  )
}
