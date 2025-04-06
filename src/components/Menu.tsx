interface MenuProps {
  startGame: (mode: 'vsPlayer' | 'vsComputer' | 'liveMatch') => void;
  showTutorial: () => void;
  signed: boolean;
  signIn: () => void;
  signOut: () => void;
}

const Menu = ({ startGame, showTutorial, signed, signIn, signOut }: MenuProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
        <h1 className="text-white text-[80px] font-pixelfont text-shadow mb-8">Notakto</h1>

        <button onClick={() => startGame('vsPlayer')} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
          Play vs Player
        </button>

        <button onClick={() => startGame('vsComputer')} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
          Play vs Computer
        </button>

        <button onClick={() => startGame('liveMatch')} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
          Live Match
        </button>

        <button onClick={showTutorial} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
          Tutorial
        </button>

        {signed ? (
          <button onClick={signOut} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
            Sign Out
          </button>
        ) : (
          <button onClick={signIn} className="w-full bg-blue-600 py-4 text-white text-2xl font-pixelfont">
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
