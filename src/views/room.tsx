import { Box, Text, Button, Image } from 'rebass/styled-components';
import { Label, Input } from '@rebass/forms';
import { doc, DocumentData, getDoc, onSnapshot, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"; 
import { FormEvent, useEffect } from 'react';
import { db } from '../firebase';
import Swal from 'sweetalert2';
import { useState, useRef } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import styled from 'styled-components';

interface Props {
  setCurrentView: (view: string) => void;
  activeRoomCode: string;
  activeParticipant: string
}

const Room = ({setCurrentView, activeRoomCode, activeParticipant}: Props) => {
  const [roomData, setRoomData] = useState<DocumentData>();
  const [activeImageUrl, setActiveImageUrl] = useState<string>('');
  const [answerInput, setAnswerInput] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null)

  const handleAnswerSubmit = async () => {
    //@ts-ignore
    const indexToReveal = roomData?.tiles?.findIndex(tile => tile.answer === answerInput && tile.revealedBy === '');
    if(indexToReveal !== -1) {
      const docRef = doc(db, "rooms", activeRoomCode);
      let tmpTiles = roomData?.tiles;
      tmpTiles[indexToReveal] = {...tmpTiles[indexToReveal], revealedBy: activeParticipant};

      await updateDoc(docRef, {
        //@ts-ignore
        log: arrayUnion({
          timestamp: Timestamp.now(),
          participant: activeParticipant,
          message: `Has revealed a tile with answer \'${answerInput}\'!`,
        }),
        tiles: tmpTiles,
      }).catch(err => console.log(err)); 
    } else {
      logger(`Has answered: \'${answerInput}\'. Fail!`)
    }

  }

  const logger = async (message: string) => {
    const docRef = doc(db, "rooms", activeRoomCode);

    await updateDoc(docRef, {
      //@ts-ignore
      log: arrayUnion({
        timestamp: Timestamp.now(),
        participant: activeParticipant,
        message,
      }),
    }).catch(err => console.log(err));  
  }

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "rooms", activeRoomCode), (doc) => {
      console.log("Current data: ", doc.data());
      const data = doc.data();
      if(!activeImageUrl) {
        const storage = getStorage();
        getDownloadURL(ref(storage, data?.imgUrl)).then(url => setActiveImageUrl(url)).catch(err => console.log(err));
      }
      setRoomData(data);
    });
    logger('Has joined the room!');
    return () => {
      unSub();
    }
  }, []);

  // useEffect(() => {
  //   if(imageRef.current) {
  //     console.log('testing ref', imageRef?.current?.clientWidth());
  //   }
  // }, [imageRef]);

  const handleImageLoad = (e: any) => {
    setImageWidth(e.target.clientWidth);
    setImageHeight(e.target.clientHeight);
    setImageLoaded(true);
  }

  if (!roomData) {
    <Box>Loading...</Box>
  }

  return (
    <Box sx={{position: 'relative', height: '100%'}}>
        <Image sx={{visibility: imageLoaded ? 'visible' : 'hidden'}} ref={imageRef} src={activeImageUrl} onLoad={handleImageLoad}/>
        <Overlay height={imageHeight} width={imageWidth}>
        {/*@ts-ignore */}
        { roomData?.tiles.map((tile) => {   
            return <Tile tileNum={roomData?.tiles?.length} revealed={!!tile?.revealedBy} height={imageHeight} width={imageWidth}></Tile>
          })
        }
        </Overlay>
        <Label htmlFor='roomName'>Enter answer:</Label>
        <Input
          mt={2}
          id='answer'
          name='answer'
          type='text'
          placeholder='Enter answer'
          value={answerInput}
          /*@ts-ignore */
          onChange={e => setAnswerInput(e?.target?.value)}
        />
        <Button mt={2} onClick={handleAnswerSubmit}>Submit</Button>
        <Text mt={5}>Log</Text>
        <Log>
        {/*@ts-ignore */}
        { roomData?.log?.map((entry) => {
            return <div><Text display='inline' fontWeight='bold'>{entry.participant}:</Text>{entry.message}</div>
          })
        }
        </Log>
    </Box>
  );
}

const Overlay = styled.div<{height: number, width: number}>`
  height: ${p => p?.height}px;
  height: ${p => p?.width}px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
`;

const Tile = styled.div<{tileNum: number, revealed: boolean, height: number, width: number}>`
  background-color: black;
  height: ${p => p?.height / Math.sqrt(p.tileNum)}px;
  width: ${p => p?.width / Math.sqrt(p.tileNum)}px;
  visibility: ${p => p.revealed ? 'hidden' : 'visible'};
`;

const Log = styled.div`
  border: 1px solid gray;
`;

export default Room;
