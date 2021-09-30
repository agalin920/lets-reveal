import { Box, Text, Button } from 'rebass/styled-components';
import { Label, Input } from '@rebass/forms';
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';
import Swal from 'sweetalert2';
import { useSetRecoilState } from 'recoil';
import { roomCodeState } from '../atoms/roomCodeState';
import { participantState } from '../atoms/participantState';

const Init = () => {
  const history = useHistory();
  const setRoomCode = useSetRecoilState(roomCodeState);
  const setParticipant = useSetRecoilState(participantState);

  const handleJoinRoom = async (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      roomCode: { value: string };
      displayName: { value: string };
    };

    const docRef = doc(db, "rooms", target.roomCode.value);

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          participants: arrayUnion(target.displayName.value),
        })

        setRoomCode(target.roomCode.value);
        setParticipant(target.displayName.value);
        history.push('/room');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Room not found',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    } catch(err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'There was an unexpected error. Please try again',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  const handleCreateRoom = () => {
    history.push('/create');
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
      <Button width='100%' variant='secondary' onClick={handleCreateRoom}>
        Create Room
      </Button>
    </Box>
  );
}

export default Init;
