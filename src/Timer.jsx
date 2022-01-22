import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect, useRef } from 'react';
import PlayingButton from './PlayingButton';
import PauseButton from './PauseButton';
import RestartButton from './RestartButton';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function Timer() {
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); // work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);
  
    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    }

    function handleClickProgress() {
        const nextPause = !isPausedRef.current;
        setIsPaused(nextPause);
        isPausedRef.current = nextPause;
    }

    function handleClickReset() {
        setMode('work');
        setIsPaused(true);
        setSecondsLeft(1500);
        modeRef.current = 'work';
        secondsLeftRef.current = 1500;
        isPausedRef.current = true;
    }


    useEffect(() => {
        function switchMode() {
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode === 'work' ? 1500 : 150);
      
            setMode(nextMode);
            modeRef.current = nextMode;
      
            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
          }
    
        secondsLeftRef.current = 1500;
        setSecondsLeft(secondsLeftRef.current);
    
        const interval = setInterval(() => {
            if (isPausedRef.current) {
              return;
            }
            if (secondsLeftRef.current === 0) {
              return switchMode();
            }
      
            tick();
          }, 1500);
      
          return () => clearInterval(interval);
      }, [1500]);

    const totalSeconds = mode === 'work' ? 1500 : 150;
    const percentage = (secondsLeft / totalSeconds) * 100;
    let secLeft = secondsLeft % 60;
    if (secLeft < 10) secLeft = '0' + secLeft;
    const minLeft = Math.floor(secondsLeft / 60);


    return (
        <div>
            <div>
            <AudioPlayer
            autoPlay
            src="/alle-origini-mirko-boroni-10552.mp3"/>
            </div>
            <div className='progress-bar'>
                <CircularProgressbar value={percentage} text={minLeft + ":" + secLeft} styles={buildStyles({
                textColor: '#ff6347',
                pathColor: mode === 'work' ? '#ff6347' : '#20b2aa',
                trailColor: '#808080'
            })} />
            </div>
            <div className='buttons'>
                <button onClick={(handleClickProgress)}>{isPaused ? <PlayingButton /> : <PauseButton />}</button>
            <RestartButton onClick={handleClickReset}/>
            </div>
            
        </div>
    );
}

export default Timer;