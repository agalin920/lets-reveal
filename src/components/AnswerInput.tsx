import { Label, Input } from '@rebass/forms';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { FormEvent, useState } from 'react';
import { Box, Button } from 'rebass/styled-components';
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"; 
import { db } from '../firebase';
import { participantState } from '../atoms/participantState';
import { roomCodeState } from '../atoms/roomCodeState';
import { roomTiles } from '../atoms/roomDataState';
import { logger } from '../utils/logger';

export const AnswerInput = () => {
  const [answerInput, setAnswerInput] = useState('');

  const roomCode = useRecoilValue(roomCodeState); 
  const participant = useRecoilValue(participantState);
  const tiles = useRecoilValue(roomTiles); 
  
  const handleAnswerSubmit = async () => {
    const indexToReveal = tiles?.findIndex(tile => tile.answer === answerInput && tile.revealedBy === '');
    if(indexToReveal !== -1) {
      const docRef = doc(db, "rooms", roomCode);
      let tmpTiles = [...tiles];
      tmpTiles[indexToReveal] = {...tmpTiles[indexToReveal], revealedBy: participant};

      await updateDoc(docRef, {
        log: arrayUnion({
          timestamp: Timestamp.now(),
          participant: participant,
          message: `Has revealed a tile with answer '${answerInput}'!`,
        }),
        tiles: tmpTiles,
      }).catch(err => console.log(err)); 
    } else {
      logger(roomCode, participant,`Has answered: '${answerInput}'. Fail!`)
    }
  }

  const handleAnswerInputChange = (e: FormEvent<HTMLInputElement>) => {
    setAnswerInput(e.currentTarget.value);
  }

  return (
    <Wrapper>
      <Label htmlFor='roomName'>Enter answer:</Label>
      <Input
        mt={2}
        id='answer'
        name='answer'
        type='text'
        placeholder='Enter answer'
        maxLength={255}
        value={answerInput}
        onChange={handleAnswerInputChange}
        required
      />
      <Box textAlign='right'>
        <Button mt={2} variant='primary' onClick={handleAnswerSubmit}>Submit</Button>
      </Box>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  
`;
