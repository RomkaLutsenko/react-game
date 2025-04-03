import prizeGlow from '../../assets/icons/prize_glow.png'
import rubyImage from '../../assets/icons/ruby.png'
import './Scale.css'

interface ScaleProps {
	result: number
}

const Scale: React.FC<ScaleProps> = ({ result }) => {
	const totalSegments = 7

	const minHeight = 18
	const maxHeight = 48

	const colors: string[] = [
		'#D1DEFB', // верхний
		'#B7C8ED',
		'#94AADC',
		'#7593D6',
		'#5878BE',
		'#3A5CA5',
		'#254B9D', // нижний
	]

	const activeColors: string[] = [
		'#F65A5A',
		'#FF784E',
		'#FFAE4E',
		'#FFDF35',
		'#91E508',
		'#00D355',
		'#00B047',
	]

	const segmentValue = Math.floor(22.51 / totalSegments)
	const activeCount = Math.floor(result / segmentValue)

	return (
		<div className='scale-container'>
			<div className={result >= 19 ? 'scale-top-prize' : 'scale-top'}>
				{result >= 19 && (
					<div
						className='ruby-glow'
						style={{ backgroundImage: `url(${prizeGlow})` }}
					></div>
				)}
				<img src={rubyImage} alt='Ruby' className='ruby-img' />
			</div>

			<div className='scale-body'>
				{Array.from({ length: totalSegments }).map((_, index) => {
					const segmentHeight =
						minHeight + (maxHeight - minHeight) * (index / (totalSegments - 1))
					const isActive = index >= totalSegments - activeCount
					const backgroundColor = isActive ? activeColors[index] : colors[index]
					return (
						<div
							key={index}
							className='segment'
							style={{
								height: `${segmentHeight}px`,
								background: backgroundColor,
							}}
						></div>
					)
				})}
			</div>
		</div>
	)
}

export default Scale
