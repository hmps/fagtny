import Head from 'next/head';
import Link from 'next/link'
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react';
import Layout from '../components/Layout'

type Player = { name: string; fakeArtist?: boolean; points: number; };
type State = 'waiting' | 'preparing' | 'playing' | 'voting' | 'guessing' | 'summary';
type Subject = {
  subject: string;
  category: string;
};
type Game = {
  currentRound: number;
  currentRoundWinner?: 'fakeArtist' | 'realArtists';
}

const subjects = [
  { subject: 'fotboll', category: 'sport' },
  { subject: 'golf', category: 'sport' },
  { subject: 'hockey', category: 'sport' },
  { subject: 'tennis', category: 'sport' },
  { subject: 'basket', category: 'sport' },
  { subject: 'cykel', category: 'fordon' },
  { subject: 'bil', category: 'fordon' },
  { subject: 'båt', category: 'fordon' },
  { subject: 'kanot', category: 'fordon' },
  { subject: 'flygplan', category: 'fordon' },
  { subject: 'hus', category: 'saker' },
  { subject: 'konsert', category: 'musik' },
  { subject: 'fiol', category: 'musik' },
  { subject: 'piano', category: 'musik' },
  { subject: 'gitarr', category: 'musik' },
  { subject: 'äpple', category: 'mat' },
  { subject: 'banan', category: 'mat' },
  { subject: 'tårta', category: 'mat' },
  { subject: 'ägg', category: 'mat' },
  { subject: 'eld', category: 'utomhus' },
  { subject: 'gran', category: 'utomhus' },
  { subject: 'hav', category: 'utomhus' },
  { subject: 'sol', category: 'utomhus' },
  { subject: 'glass', category: 'sommarlov' },
  { subject: 'elefant', category: 'djur' },
  { subject: 'ko', category: 'djur' },
  { subject: 'häst', category: 'djur' },
  { subject: 'gris', category: 'djur' },
  { subject: 'mygga', category: 'djur' },
  { subject: 'geting', category: 'djur' },
  { subject: 'krabba', category: 'djur' },
  { subject: 'jultomte', category: 'högtider' },
  { subject: 'midsommarstång', category: 'högtider' },
  { subject: 'påskägg', category: 'högtider' },
  { subject: 'halloween-pumpa', category: 'högtider' },
  { subject: 'lampa', category: 'elektronik' },
  { subject: 'dator', category: 'elektronik' },
  { subject: 'smartphone', category: 'elektronik' },
  { subject: 'kaffekopp', category: 'saker' },
  { subject: 'stekpanna', category: 'saker' },
];

const colors = {
  pink: '#E4007F',
  yellow: '#FFF100',
  blue: '#577590',
  orange: '##F08A4B'
};
const emptyPlayer: Player = { name: '', fakeArtist: false, points: 0 };
const numberOfRounds = 3;

const IndexPage = () => {
  const [state, setState] = useState('waiting');
  const [subject, setSubject] = useState<Subject>();
  const [game, setGame] = useState<Game>({ currentRound: 0, });

  const [players, setPlayers] = useState<Player[]>(Array(3).fill(emptyPlayer));

  const setupRound = useCallback(
    () => {
      const newSubject = subjects[Math.floor(Math.random() * subjects.length)];
      setSubject(newSubject);
      const index = Math.floor(Math.random() * players.length);
      setPlayers(currentPlayers => currentPlayers.map((currentPlayer, currentPlayerIndex) => ({
        ...currentPlayer,
        fakeArtist: currentPlayerIndex === index,
      })));
      setState('preparing');
      setGame(game => ({
        ...game,
        currentRound: game.currentRound + 1,
      }));
    },
    [setSubject],
  );

  const finishRound = useCallback((winner: 'fake' | 'real') => {
    const fakeArtistPoints = winner === 'fake' ? 1 : 0;
    const realArtistPoints = winner === 'fake' ? 0 : 1;

    setPlayers(players => {
      const updatedPlayers = players.map((currentPlayer) => ({
        ...currentPlayer,
        points: currentPlayer.fakeArtist ? currentPlayer.points + fakeArtistPoints : currentPlayer.points + realArtistPoints,
      })).sort((a, b) => b.points - a.points);

      return updatedPlayers;
    })

    setGame(game => ({
      ...game,
      currentRoundWinner: winner === 'fake' ? 'fakeArtist' : 'realArtists',
    }))
  }, [setPlayers, setGame]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <div
        style={{
          backgroundColor: colors.pink,
          paddingBottom: '80px',
        }} className='flex flex-col items-center'>
        <h1 style={{
          color: colors.yellow,
          backgroundColor: colors.pink,
          fontSize: '36px',
          lineHeight: '36px',
          padding: 0,
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          fontWeight: 'bold',
        }} className="p-4 text-center">A FAKE ARTIST GOES TO NEW YORK</h1>
        <div style={{ maxWidth: '800px' }}>

          {state === 'waiting' && (
            <ListOfPlayers players={players} setPlayers={setPlayers} setupGame={setupRound} />
          )}
          {state === 'preparing' && (
            <Prepare players={players} subject={subject} setState={setState} />
          )}
          {state === 'playing' && (
            <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">
              <Heading>Dags att rita!</Heading>
              <Text>Rita 2 omgångar var. När du lyfter pennan är det nästa persons tur</Text>
              <Heading>Kategori: {subject.category}</Heading>
              <button onClick={() => {
                setState('voting');
              }}
                className="p-4" style={{ backgroundColor: colors.yellow }}>Vi är klara!</button>
            </div>
          )}
          {state === 'voting' && (
            <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">
              <Heading>Kan ni hitta den falska konstnären?</Heading>
              <Text>Räkna gemensamt ner från 3. När ni kommer till 0 pekar alla på den person de tror är den falska konstnären.</Text>
              <Text>Gissade ni rätt?</Text>
              <div className="flex flex-row gap-4">
                <button onClick={() => {
                  setState('guessing');
                }}
                  className="p-4 px-8" style={{ backgroundColor: colors.yellow }}>Ja</button>
                <button onClick={() => {
                  finishRound('fake');
                  if (game.currentRound === numberOfRounds) {
                    setState('finished');
                  } else {
                    setState('summary');
                  }
                }}
                  className="p-4 px-8" style={{ backgroundColor: colors.yellow }}>Nej</button>
              </div>
            </div>
          )}
          {state === 'guessing' && (
            <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-2">
              <Heading>{players.find(player => player.fakeArtist === true).name}, dags att gissa!</Heading>
              <Text>Vilket ämne det var gruppen ritade.</Text>
              <Text>Gissade du rätt?</Text>
              <div className="flex flex-row gap-4">
                <button onClick={() => {
                  finishRound('fake');
                  if (game.currentRound === numberOfRounds) {
                    setState('finished');
                  } else {
                    setState('summary');
                  }
                }}
                  className="p-4" style={{ backgroundColor: colors.yellow }}>Ja</button>
                <button onClick={() => {
                  finishRound('real');
                  if (game.currentRound === numberOfRounds) {
                    setState('finished');
                  } else {
                    setState('summary');
                  }
                }}
                  className="p-4" style={{ backgroundColor: colors.yellow }}>Nej</button>
              </div>
            </div>
          )}
          {state === 'summary' && (
            <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-4">
              <Heading>Omgång {game.currentRound}/{numberOfRounds} klar!</Heading>
              <Text>{game.currentRoundWinner === 'fakeArtist' ? 'Den falska konstnären ' : 'De äkta konstärerna '} vann och fick poäng!</Text>
              <table className="w-full">
                <thead>
                  <tr>
                    <th><Text bold={true}>Spelare</Text></th>
                    <th><Text bold={true}>Poäng</Text></th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.name}>
                      <th><Text>{player.name}</Text></th>
                      <th><Text>{player.points}</Text></th>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => {
                if (game.currentRound < 3) {
                  setupRound();
                } else {
                  setState('finished');
                }
              }}
                className="p-4" style={{ backgroundColor: colors.yellow }}>Nästa omgång</button>
            </div>
          )}
          {state === 'finished' && (
            <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-4">
              <Heading>{players[0]?.name} är dagens vinnare!</Heading>
              <table className="w-full">
                <thead>
                  <tr>
                    <th><Text bold={true}>Spelare</Text></th>
                    <th><Text bold={true}>Poäng</Text></th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.name}>
                      <th><Text>{player.name}</Text></th>
                      <th><Text>{player.points}</Text></th>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => {
                setPlayers(currentPlayers => currentPlayers.map(currentPlayer => ({ ...currentPlayer, points: 0 })));
                setGame(game => ({
                  ...game,
                  currentRound: 0,
                }))
                setState('waiting');
              }}
                className="p-4" style={{ backgroundColor: colors.yellow }}>Starta nytt spel</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IndexPage

function ListOfPlayers({ players, setPlayers, setupGame, }: { players: Player[]; setPlayers: Dispatch<SetStateAction<Player[]>>; setupGame: () => void; }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6">
      <Heading>Väkomna!</Heading>
      <Text>Börja med att skriva in alla spelares namn nedan.</Text>
      <div className="flex flex-col items-center justify-center py-2 gap-3 w-full">
        {players.map((player, index) => {
          return (
            <input key={index} type="text" onChange={(e) => {
              if (players.length >= 10) return;

              setPlayers(currentPlayers => currentPlayers.map((currentPlayer, currentPlayerIndex) => ({
                ...currentPlayer,
                name: currentPlayerIndex === index ? e.target.value : currentPlayer.name,
              })));
            }}
              placeholder={i18n.name[lang]} value={player.name} id={`player-${index}`} className="p-3 border-solid w-full" />
          )
        })}
        <button onClick={() => {
          setPlayers(p => {
            return [...p, emptyPlayer];
          })
        }} className="p-2 text-sm self-end" >+ {i18n.addPlayer[lang]}</button>
        <button onClick={() => {
          setupGame();
        }}
          disabled={players.some(player => player.name === '')}
          className="p-4 mt-4 font-bold" style={{ backgroundColor: colors.yellow }}>{i18n.showRoles[lang]}</button>
      </div>
    </div>
  )
}


function Prepare({ players, subject, setState }: { players: Player[], subject: Subject; setState: Dispatch<SetStateAction<State>>; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6">
      {showRole === true ? (
        <div className="flex flex-col items-center justify-start p-6">
          <Heading>
            Du är {players[currentIndex].fakeArtist ? 'den falska konstnären' : 'äkta konstnär'}
          </Heading>
          { }
          <div className="mt-8 mb-8 gap-2">
            {players[currentIndex].fakeArtist ? (
              <Text>Du får inte veta ämnet...</Text>
            ) : (
              <>
                <Text>Ämnet ni ska rita är</Text>
                <Heading>{subject.subject}</Heading>
              </>
            )}
          </div>
          <button onClick={() => {
            if (currentIndex === players.length - 1) {
              setState('playing')
              return;
            }
            setShowRole(false);
            setCurrentIndex(currentIndex + 1);
          }}
            className="p-4" style={{ backgroundColor: colors.yellow }}>{currentIndex === players.length - 1 ? "Starta spelet" : "Nästa spelare"}</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start p-6 gap-4">
          <Heading>Alla utom {players[currentIndex].name} - blunda!</Heading>
          <Text>
            När alla blundar trycker {players[currentIndex].name} på knappen nedan.
          </Text>
          <button onClick={() => {
            setShowRole(true);
          }}
            className="p-4" style={{ backgroundColor: colors.yellow }}>Visa min roll</button>
        </div>
      )
      }
    </div >
  )
}

const Text = ({ children, bold }: { children: ReactNode, bold?: boolean; }) => <p className={`text-center py-1 text-xl ${bold ? 'font-semibold' : 'font-extralight'}`} style={{ color: colors.yellow }}>{children}</p>
const Heading = ({ children }: { children: ReactNode; }) => <h3 className={`text-center py-1 text-3xl font-bold`} style={{ color: colors.yellow }}>{children}</h3>

type Languages = 'en' | 'se';

const lang: Languages = 'se';

const i18n: { [key: string]: { se: string; en: string; } } = {
  addPlayer: { en: 'Add player', se: 'Lägg till spelare' },
  name: { en: 'Name', se: 'Namn' },
  startGame: { en: 'Start game', se: 'Starta spelet' },
  showRoles: { en: 'Show roles and subject', se: 'Visa roller och ämne' },
};

