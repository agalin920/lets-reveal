import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Image } from 'rebass/styled-components';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import {useWindowSize} from 'react-use';
import { roomTiles } from '../atoms/roomDataState';

interface Props {
  activeImageUrl: string,
}

export const PlayImage = ({activeImageUrl}: Props) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const tiles = useRecoilValue(roomTiles); 

  const {width, height} = useWindowSize();

  useEffect(() => {
    setImageWidth(imageRef?.current?.clientWidth || 0);
    setImageHeight(imageRef?.current?.clientHeight || 0);
  }, [width, height])

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setImageWidth(e.currentTarget.clientWidth);
    setImageHeight(e.currentTarget.clientHeight);
    setImageLoaded(true);
  };

  return (
    <Wrapper>
      <Image
        sx={{visibility: imageLoaded ? 'visible' : 'hidden'}}
        ref={imageRef}
        src={activeImageUrl}
        onLoad={handleImageLoad}
      />
      <Overlay height={imageHeight} width={imageWidth}>
        {tiles.map((tile) => {   
          return (
            <Tile
              key={tile.answer}
              tileNum={tiles.length}
              revealed={!!tile?.revealedBy}
              height={imageHeight}
              width={imageWidth}
            ></Tile>
          )})
        }
      </Overlay>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`

const Overlay = styled.div<{height: number, width: number}>`
  height: ${p => p?.height}px;
  width: ${p => p?.width}px;
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