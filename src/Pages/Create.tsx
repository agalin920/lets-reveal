import { SyntheticEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Text, Button } from 'rebass/styled-components';
import { Label, Input, Textarea } from '@rebass/forms';
import Swal from 'sweetalert2'
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import Dropzone, { IFileWithMeta } from 'react-dropzone-uploader'
import shortUUID from 'short-uuid';
import { db, storage } from '../firebase';
import { shuffle } from '../utils/shuffler';
import { isSquare } from '../utils/isSquare';

import 'react-dropzone-uploader/dist/styles.css'

const Create = () => {
  const history = useHistory();
  const [file, setFile] = useState<File>();

  const handleChangeStatus = (file: IFileWithMeta) => {
    setFile(file.file);
  };

  const handleCreate = async (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      roomName: { value: string };
      answers: { value: string };
    };

    const roomName = target.roomName.value;
    const answersArray= target.answers.value.split(',').map(x => x.trim());

    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'You must upload a file!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (!isSquare(answersArray.length)) {
      Swal.fire({
        title: 'Error!',
        text: 'The amount of answers entered must be a square number!',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    // Upload Image
    let imgUrl;
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const response = await uploadBytes(storageRef, file);
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
      });

      history.push('/');
      
    } catch(err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'There was an unexpected error. Please try again',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
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
