import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/Layout';

function App() {
  return (
    <PlayerProvider>
      <Layout />
    </PlayerProvider>
  );
}

export default App
