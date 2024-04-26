import { Alert, Button, TextInput } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { app } from '../firebase'

const DashProfile = () => {
    const filePickerRef = useRef()
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)

    console.log(imageFileUploadProgress)
    console.log(imageFileUploadError)

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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadUrl => {
                        setImageFileUrl(downloadUrl)
                    })
            }
        )
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    return (
        <div className='max-w-lg max-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
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
                />
                <TextInput
                    type='text'
                    id='email'
                    placeholder='Email'
                    defaultValue={currentUser.email}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='Password'
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
                <span className='cursor-pointer
                '>Delete account</span>
                <span className='cursor-pointer'>Delete account</span>
            </div>
        </div>
    )
}

export default DashProfile
