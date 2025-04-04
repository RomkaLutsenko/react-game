import { useCallback, useEffect, useState } from 'react'
import './App.css'

import mainScaleBg from '../assets/icons/bg_top.png'
import buttonNormal from '../assets/icons/button.png'
import buttonPressed from '../assets/icons/button_active.png'
import hammerImg from '../assets/icons/hammer.png'
import machineImg from '../assets/icons/measure_main.png'
import robotSad from '../assets/icons/robot_1.png'
import robotNeutral from '../assets/icons/robot_2.png'
import robotHappy from '../assets/icons/robot_3.png'
import powerScale from '../assets/icons/scale-1.png'
import powerScaleBg from '../assets/icons/scale.png'
import Scale from './Scale/Scale'

type GameState = 'start' | 'playing' | 'result'

interface ResultData {
	element?: React.ReactNode
	robot: string
	color: string
}

function getRandomInRange(min: number, max: number, float = false) {
	const result = Math.random() * (max - min) + min
	return float ? result : Math.floor(result)
}

function useInterval(callback: () => void, delay: number | null) {
	useEffect(() => {
		if (delay === null) return
		const id = setInterval(() => callback(), delay)
		return () => clearInterval(id)
	}, [delay])
}

function Game() {
	const [gameState, setGameState] = useState<GameState>('start')
	const [power, setPower] = useState<number>(0)
	const [result, setResult] = useState<number>(0)

	const [isHammerAnimating, setIsHammerAnimating] = useState<boolean>(false)
	const [isHammerPreparing, setIsHammerPreparing] = useState<boolean>(false)
	const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false)

	// Обновление силы удара во время игры
	useInterval(
		() => {
			setPower(prev => {
				const baseChange = getRandomInRange(3, 3)
				const randomBoost = Math.random() > 0.5 ? 6 : 0
				const direction = Math.random() > 0.1 ? 1 : -1
				const newPower = prev + (baseChange + randomBoost) * direction
				return Math.min(22.51, Math.max(0, newPower))
			})
		},
		gameState === 'playing' ? 600 : null
	)

	const handleStart = useCallback((): void => {
		setIsButtonPressed(false)
		setIsHammerAnimating(false)
		setGameState('playing')
		setIsHammerPreparing(true)
		setResult(0)
		setPower(0)
	}, [])

	const handleHit = useCallback((): void => {
		setGameState('result')
		setResult(power)
		setIsButtonPressed(true)
		setIsHammerPreparing(false)
		setIsHammerAnimating(true)
	}, [power])

	const getResultData = useCallback((): ResultData => {
		if (result >= 19) {
			return {
				element: (
					<p className='start-screen__text'>
						ВОТ ЭТО СИЛА! <br />
						Ты выбил главный приз! <br />
						<span style={{ color: 'red' }}>Рубин</span>
					</p>
				),
				robot: robotHappy,
				color: '#4CAF50',
			}
		} else if (result > 0) {
			return {
				element: (
					<p className='start-screen__text'>
						Неплохо! <br />
						Попробуй ещё раз.
					</p>
				),
				robot: robotNeutral,
				color: '#FFC107',
			}
		}
		return {
			robot: robotSad,
			color: '#F44336',
		}
	}, [result])

	const resultData = getResultData()

	return (
		<div
			className='game-container'
			style={{ backgroundImage: `url(${mainScaleBg})` }}
		>
			<div className='top'>
				<div
					className='machine-bg'
					style={{ backgroundImage: `url(${machineImg})` }}
				>
					<Scale result={result} />
				</div>
				<img
					src={isButtonPressed ? buttonPressed : buttonNormal}
					alt='Hit Button'
					className='hit-button'
					role='button'
					aria-label='Ударить молотом'
				/>
				<img
					src={hammerImg}
					alt='Hammer'
					className={`hammer ${isHammerAnimating ? 'hammer-hit' : ''} ${
						isHammerPreparing ? 'hammer-prepare' : ''
					}`}
				/>
			</div>

			<div className='bottom'>
				<div
					className='power-scale-bg'
					style={{ backgroundImage: `url(${powerScaleBg})` }}
				>
					<div
						className='power-scale'
						style={{ backgroundImage: `url(${powerScale})` }}
					>
						<div className='scale' style={{ height: `${power}%` }} />
					</div>
				</div>

				{gameState === 'start' && (
					<div className='start-screen'>
						<p className='start-screen__text'>
							Привет! <br />
							Проверим твою силу!
						</p>
						<button onClick={handleStart} className='button button-new-game'>
							НОВАЯ ИГРА
						</button>
					</div>
				)}
				{gameState === 'playing' && (
					<div className='start-screen'>
						<p className='start-screen__text'>Жми на кнопку в нужный момент!</p>
						<button onClick={handleHit} className='button button-hit'>
							УДАР!
						</button>
					</div>
				)}
				{gameState === 'result' && (
					<div className='start-screen'>
						{resultData.element}
						<button onClick={handleStart} className='button button-new-game'>
							НОВАЯ ИГРА
						</button>
					</div>
				)}

				<img
					src={resultData.robot}
					alt='Robot reaction'
					className='result-robot'
				/>
			</div>
		</div>
	)
}

export default Game
