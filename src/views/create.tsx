import { FormEvent, useState } from 'react';
import { Box, Text, Button } from 'rebass/styled-components';
import { Label, Input, Textarea } from '@rebass/forms';
import Swal from 'sweetalert2'
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { db, storage } from '../firebase';
import { shuffle } from '../utils/shuffler';
import shortUUID from 'short-uuid';

interface Props {
  setCurrentView: (view: string) => void;
}

const Create = ({setCurrentView}: Props) => {
  const [file, setFile] = useState(null)

  const handleChangeStatus = (file: any) => {
    setFile(file.file);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    //@ts-ignore
    const roomName = e.target.roomName.value;
    //@ts-ignore
    const answersArray = e.target.answers.value?.split(',')?.map(x => x?.trim());

    //@ts-ignore
    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'You must upload a file!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    // Upload Image
    let imgUrl;
    try {
      
      //@ts-ignore
      const storageRef = ref(storage, `images/${file.name}`);
      //@ts-ignore
      const response = await uploadBytes(storageRef, file);
      //@ts-ignore
      imgUrl = response.metadata.fullPath
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue uploading your image. Please try again or use another image',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
    //Create doc
    try {
      const roomCode = shortUUID.generate();
      await setDoc(doc(db, "rooms", roomCode), {
        roomName,
        imgUrl,
        tiles: shuffle(answersArray).map((answer) => {
          return {
            answer,
            revealedBy: '',
          }
        }),
        log: [],
        participants: [],
      });

      Swal.fire({
        title: 'Success!',
        text: `Your Room Code is: ${roomCode}`,
        icon: 'success',
        confirmButtonText: 'Ok'
      })

      setCurrentView('init');
      
    } catch(err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'There was an unexpected error. Please try again',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
  }
  return (
    <Box as='form' onSubmit={handleCreate}>
      <Label htmlFor='roomName'>Enter room name:</Label>
      <Input
        mt={2}
        id='roomName'
        name='roomName'
        type='text'
        placeholder='Room name'
        required
      />
      <Text my={2}>Upload Image: </Text>
      <Dropzone 
        // getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        inputContent="Drop A File"
        accept="image/*"
      />
      <Label mt={2} htmlFor='answers'>Enter answers separated by a comma:</Label>
      <Text fontSize='12px' fontStyle='italic' color='darkgray'>Answers are not case sensitive and can be duplicated.</Text>
      <Textarea
        mt={2}
        id='answers'
        name='answers'
        required
      />
      <Button mt={3} width='100%' variant='primary' type='submit'>
        Create
      </Button>
    </Box>
  );
}

export default Create;
