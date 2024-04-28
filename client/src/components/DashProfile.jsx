import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {AiOutlineExclamationCircle} from 'react-icons/ai'

import { app } from '../firebase'
import serviceApi from '../api/index.api';
import { updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess } from '../redux/user/userSlice';

const DashProfile = () => {
    const dispatch = useDispatch()
    const filePickerRef = useRef()
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [formData, setFormData] = useState({})
    const [showModal, setShowModal]  = useState(false)


    const handleChangeFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    const uploadImage = async () => {
        //su dung storage trong firebase
        //     service firebase.storage {
        //         match / b / { bucket } / o {
        //             match / { allPaths=**} {
        //   allow read;
        //   allow write: if
        //   request.resource.size < 2 * 1024 * 1024 &&
        //                     request.resource.contentType.matches('image/.*')
        // }
        //         }
        //     }
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                //cai tien trinh upload img
                setImageFileUploadProgress(progress)
            },
            error => {
                setImageFileUploadError('Cound not upload image ( File must be less than 2MB )')
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadUrl => {
                        setImageFileUrl(downloadUrl)
                        setFormData({...formData, profilePicture:downloadUrl})
                        setImageFileUploading(false)
                    })
            }
        )
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})

    }

    const handleSubmit =async e => {
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)


        if(Object.keys(formData).length === 0){
            setUpdateUserError('No changes made')
            return
        }
        if(imageFileUploading){
        setUpdateUserError('Please wait for image to upload')
            return
        }
        // serviceApi.updateUser(currentUser._id, formData, dispatch)
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()


            if(!res.ok){
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data.user))
                setUpdateUserSuccess("User's profile updated successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
        }
    } 

    const handleDeleteUser = async () => {
        setShowModal(false)


        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            })

            const data = await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(data.message))
            }else{
                dispatch(deleteUserSuccess())
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            const res = await fetch(`/api/user/signout`, {
                method: "POST"
            })
            const data = await res.json()

            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(signOutSuccess())
            }

        } catch (error) {
            
        }
    }

    return (
        <div className='max-w-lg max-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='img/*' hidden ref={filePickerRef} onChange={handleChangeFile} />
                <div onClick={() => filePickerRef.current.click()} className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    {
                        imageFileUploadProgress &&
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                                }
                            }}
                        >

                        </CircularProgressbar>
                    }
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full border-8 object-cover boder-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
                    />
                </div>
                {
                    imageFileUploadError &&
                    <Alert color={'failure'}>
                        {imageFileUploadError}
                    </Alert>
                }
                <TextInput
                    type='text'
                    id='username'
                    placeholder='Username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type='text'
                    id='email'
                    placeholder='Email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='Password'
                    onChange={handleChange}
                />
                <Button
                    type='submit'
                    gradientDuoTone={'purpleToBlue'}
                    outline
                >
                    Update
                </Button>
            </form>

            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete account</span>
                <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
            </div> 
            {
                updateUserSuccess &&   (
                    <Alert color={'success'} className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )
            }
            {
                updateUserError &&   (
                    <Alert color={'failure'} className='mt-5'>
                        {updateUserError}
                    </Alert>
                )
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">
                        <AiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete account?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashProfile
