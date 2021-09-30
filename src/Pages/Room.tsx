import { Box, Text } from 'rebass/styled-components';
import { doc, onSnapshot } from "firebase/firestore"; 
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { db } from '../firebase';
import { roomCodeState } from '../atoms/roomCodeState';
import { participantState } from '../atoms/participantState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { RoomData, roomDataState, roomLoaded, roomName } from '../atoms/roomDataState';
import { PlayImage } from '../components/PlayImage';
import { logger } from '../utils/logger';
import { Log } from '../components/Log';
import { AnswerInput } from '../components/AnswerInput';

export const Room = () => {
  const history = useHistory();
  const [activeImageUrl, setActiveImageUrl] = useState('');

  const setRoomData = useSetRecoilState(roomDataState); 
  const loaded = useRecoilValue(roomLoaded); 
  const name = useRecoilValue(roomName); 
  const roomCode = useRecoilValue(roomCodeState); 
  const participant = useRecoilValue(participantState); 

  useEffect(() => {
    //boots user to initial page on refresh
    if(!roomCode) {
      history.push('/');
      return;
    };
    const unSub = onSnapshot(doc(db, "rooms", roomCode), (doc) => {
      console.log("Current data: ", doc.data());
      const data = doc.data() as RoomData;
      if(!activeImageUrl) {
        const storage = getStorage();
        getDownloadURL(ref(storage, data.imgUrl)).then(url => setActiveImageUrl(url)).catch(err => console.log(err));
      }
      setRoomData({...data, loaded: true});
    });
    logger(roomCode, participant, 'Has joined the room!');
    return () => {
      unSub();
    }
  }, []);

  if (!loaded) {
    return <Box>Loading...</Box>
  }

  return (
    <Box sx={{height: '100%'}}>
      <Box mt={3} textAlign='center'>
        <Text fontSize={6}>{name}</Text>
      </Box>
      <PlayImage activeImageUrl={activeImageUrl} />
      <Box mt={3}>
        <Log />
      </Box>
      <Box mt={3}>
        <AnswerInput/>
      </Box>
    </Box>
  );
}
