import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {CircularProgressbar} from 'react-circular-progressbar'

import {app} from '../firebase'

const CreatePost = () => {
    const [file, setFie] = useState(null)
    const [uploadImageProgress, setUploadImageProgress] = useState(null)
    const [uploadImageError, setUploadImageError] = useState(null)
    const [formData, setFormData] = useState({})

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

  return <div className="p-3 max-w-3xl mx-auto  min-h-screen">
    <h1 className='text-center  text-3xl my-7 font-semibold' >Create a post</h1>
    <form className='flex flex-col gap-4'>
        <div className="flex flex-col gap-4 sm:flex-row justify-between ">
            <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                className='flex-1'
                
            />
            <Select>
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
        <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone={'purpleToPink'}>
            Publish
        </Button>
    </form>
  </div>
}


export default CreatePost
