import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {CircularProgressbar} from 'react-circular-progressbar'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'

import {app} from '../firebase'

const  UpdatePost = () => {
    const {postId} = useParams()
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.user)
    const [file, setFie] = useState(null)
    const [uploadImageProgress, setUploadImageProgress] = useState(null)
    const [uploadImageError, setUploadImageError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError]= useState(null)

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/getpost?postId=${postId}`)
                const data = await res.json()
                if(!res.ok){
                    console.log(data.message)
                    setPublishError(data.message)
                    return
                }

                if(res.ok){
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            }
            fetchPost()
        } catch (error) {
            console.log(error.message)
        }
    }, [postId])

    const handleUpkoadImage =async () => {
        try {
            if(!file){
                setUploadImageError('Please select an image')
                return
            }
            setUploadImageError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime()+ '-'+file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadImageProgress(progress.toFixed(0))
                },
                error => {
                    setUploadImageError('Image upload failed')
                    setUploadImageProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        setUploadImageError(null)
                        setUploadImageProgress(null)
                        setFormData({...formData, image: downloadURL})
                    })
                }
            )
        } catch (error) {
            setUploadImageError('Upload image failed')
            setUploadImageProgress(null)
        }   
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res =await fetch(`/api/post/update-post/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if(!res.ok){
                setPublishError(data.message)
                return
            }
            if(!data.success){
                setPublishError(data.message)
                return
            }
            if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.posts.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

  return <div className="p-3 max-w-3xl mx-auto  min-h-screen">
    <h1 className='text-center  text-3xl my-7 font-semibold' >Update post</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between ">
            <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                value={formData.title}
                className='flex-1'
                onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="uncategorized">Select a category</option>
                <option value="javascript">JavaScript</option>
                <option value="reactjs">React JS</option>
                <option value="nextjs">Next JS</option>
            </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput type='file' accept='image/*' onChange={e => setFie(e.target.files[0])}/>
            <Button
                type='button'
                gradientDuoTone={'purpleToBlue'}
                size={'sm'}
                outline
                onClick={handleUpkoadImage}
                disabled={uploadImageProgress}
            >
                {
                    uploadImageProgress ? 
                    <div className="w-16 h-16">
                        <CircularProgressbar value={uploadImageProgress}  text={`${uploadImageProgress || 0}%`}/>
                    </div>      :               
                    'Upload file'
                }
            </Button>
        </div>
        {
            uploadImageError && (
                <Alert color={'failure'}>
                    {uploadImageError}
                </Alert>
            )
        }
        {
            formData.image && (
                <img src={formData.image} alt="upload" className='w-full h-72 object-cover' />
            )
        }
        <ReactQuill value={formData.content} onChange={value => setFormData({...formData, content: value})} theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone={'purpleToPink'}>
            Update post
        </Button>
        {
            publishError && <Alert className='mt-5' color={'failure'}>
                {publishError}
            </Alert>
        }
    </form>
  </div>
}


export default UpdatePost