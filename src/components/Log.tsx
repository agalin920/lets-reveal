import { useEffect, useRef } from 'react';
import { Text } from 'rebass/styled-components';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { roomLog } from '../atoms/roomDataState';


export const Log = () => {
  const log = useRecoilValue(roomLog);

  const logRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if(logRef?.current) {
      logRef.current.scrollTop = logRef?.current?.scrollHeight;
    }
  }, [log.length]);
  
  return (
    <Wrapper ref={logRef}>
      {log.map(entry => {
          return (
            <LogItem>
              <Text key={entry.timestamp} display='inline' fontWeight='bold'>{entry.participant}: </Text>
              {entry.message}
            </LogItem>
          )
        })
      }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 1px solid gray;
  scroll-behavior: smooth;
`;

const LogItem = styled.div`
  overflow-wrap: break-word;
`;

