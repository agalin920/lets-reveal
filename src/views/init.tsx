import { Box, Text, Button } from 'rebass/styled-components';
import { Label, Input } from '@rebass/forms';
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { FormEvent } from 'react';
import { db } from '../firebase';
import Swal from 'sweetalert2';

interface Props {
  setCurrentView: (view: string) => void;
  setActiveRoomCode: (roomCode: string) => void;
  setActiveParticipant: (participant: string) => void;
}

const Init = ({setCurrentView, setActiveRoomCode, setActiveParticipant}: Props) => {
  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();
    //@ts-ignore
    const docRef = doc(db, "rooms", e.target.roomCode.value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        //@ts-ignore
        participants: arrayUnion(e.target.displayName.value),
      }).catch(err => console.log(err));

      //@ts-ignore
      setActiveRoomCode(e.target.roomCode.value);
      //@ts-ignore
      setActiveParticipant(e.target.displayName.value);
      setCurrentView('room');
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Room Code not found',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  return (
    <Box>
      <Box as="form" onSubmit={handleJoinRoom}>
        <Label htmlFor='roomCode'>Room Code:</Label>
        <Input
          mt={2}
          id='roomCode'
          name='roomCode'
          type='text'
          placeholder='Room code'
          required
        />
        <Label mt={2} htmlFor='displayName'>Display Name:</Label>
        <Input
          mt={2}
          id='displayName'
          name='displayName'
          type='text'
          placeholder='Display name'
          required
        />
        <Button mt={2} width='100%' variant='primary' type='submit'>
        Join Room
      </Button>
      </Box>
      <Text my={2} textAlign='center'>Or</Text>
      <Button width='100%' variant='secondary' onClick={() => setCurrentView('create')}>
        Create Room
      </Button>
    </Box>
  );
}

export default Init;
