import { Flex } from 'rebass/styled-components';
import { useState } from 'react';
import Init from './views/init';
import Create from './views/create';
import Room from './views/room';

const App = () => {
  const [currentView, setCurrentView] = useState<string>('init');
  const [activeRoomCode, setActiveRoomCode] = useState<string>('');
  const [activeParticipant, setActiveParticipant] = useState<string>('');

  const views = {
    init: <Init setCurrentView={setCurrentView} setActiveRoomCode={setActiveRoomCode} setActiveParticipant={setActiveParticipant}/>,
    create: <Create setCurrentView={setCurrentView}/>,
    room: <Room setCurrentView={setCurrentView} activeRoomCode={activeRoomCode} activeParticipant={activeParticipant}/>,
  }

  return (
    <Flex
      sx={{
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
     {/* @ts-ignore */}
      {views[currentView]}
    </Flex>
  );
}

export default App;
