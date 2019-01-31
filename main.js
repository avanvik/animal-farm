const animalFarm = document.getElementById('animal-farm')
const generatorButton = document.getElementById('btn-generate-animal')
const animalTypes = [
	{ animal: '🐷', meat: '🍖'}, 
	{ animal: '🐹', meat: '🥩'}, 
	{	animal: '🐵', meat: '🍔'}, 
	{ animal: '👶🏻', meat: '🧠'}
]

const randInt = (max) => {
	return Math.floor(Math.random() * max)
}

const generateRandomAnimal = () => {
	if (gameState.points.value >= 10){
		gameState.points.remove(10)
	
		const randomIndex = randInt(animalTypes.length)
		const animalType = animalTypes[randomIndex]

		let animal = document.createElement('span')
		animal.innerHTML = animalType.animal
		animal.classList.add('animal')

		animalLife(animal, randomIndex)
		animalFarm.append(animal)
	}
} 

let gameState = {
	points: {
		pointsContainer: document.getElementById('points-container'),
		add(val) {
			this.value += val
			this.pointsContainer.innerText = this.value
			if (this.value >= 20) {
				this.pointsContainer.style.color = 'black'
			}
		},
		remove(val) {
			if (this.value >= val) {
				this.value -= val
			} 
			if (this.value < 20){
				this.pointsContainer.style.color = 'red'
			}
			this.pointsContainer.innerText = this.value
		},
		value: 0
	},
	startTime: Date.now(),
	orientation: {
		y: 0,
		x: 0
	}
}

window.addEventListener('deviceorientation', function(event) {
	gameState.orientation.y = event.beta
	gameState.orientation.x = event.gamma
});

// Animal lifecycle
const animalLife = (animal, type) => {
	let animalState = 'alive'
	let speed = {x: 0,y: 0}
	let maxSpeed = 0.05
	
	animal.style.position = 'absolute'
	const getRandomPosition = () => {
		const minX = 20
		const maxX = animalFarm.offsetWidth - 30
		const minY = 20
		const maxY = animalFarm.offsetHeight - 40
		
		return {
			x: minX + Math.random() * (maxX - minX),
			y: minY + Math.random() * (maxY - minY)
		}
	}
	
	const drawPosition = (position) => {
		animal.style.left = position.x + 'px'
		animal.style.top = position.y + 'px'
	}
	
	const move = () => {
		if (pos.x < animalFarm.offsetWidth - 30 && pos.x > 0) {
			speed.x += ((Math.random()-0.5) * maxSpeed) + gameState.orientation.x*0.0001
		} else {
			speed.x *= -0.8
		}

		if (pos.y < animalFarm.offsetHeight - 40 && pos.y > 0) {
			speed.y += ((Math.random()-0.5) * maxSpeed) + gameState.orientation.y*0.0001
		} else {
			speed.y *= -0.8
		}

		pos.x += speed.x
		pos.y += speed.y
		drawPosition(pos)
	}
	
	let pos = getRandomPosition()
	drawPosition(pos)
	
	animal.addEventListener('click', ()=>{
		switch (animalState) {
			case 'alive':
				gameState.points.remove(20)
				break;
				
			case 'meat':
				animalState = 'money'
				animal.innerHTML = '💰'
				gameState.points.add(20)
				break;
			
			case 'dead':
				gameState.points.remove(50)
				break;
				
			case 'money':
				break;
		}
	})
	
	const maxLifeTime = 20000
	let lifeTime = 0
	let lastFrameTime = 0
	const timeAlive = 2000 + (6000 * Math.random())
	const timeMeat = timeAlive + 2000
	
	const loop = setInterval(() => {
		if (lifeTime < maxLifeTime) {
			
			if (lifeTime < timeAlive) {
				move()

			} else if (lifeTime < timeMeat) {
				if (animalState === 'alive') {
					animal.innerHTML = animalTypes[type].meat
					animalState = 'meat'
				}
			} else {
				if (animalState === 'meat') {
					animalState = 'dead'
					animal.innerHTML = '💀'
					animal.style.opacity = '0'
				} else {
					animal.style.opacity = '0'
				}
			}
		
		} else {
			animal.style.display = "none" 
			animal.parentNode.removeChild(animal)
			clearInterval(loop)
		}
		
		lifeTime += 10
	}, 10)
}

// Set up game
gameState.points.add(100)
generatorButton.addEventListener('click', (e)=>{
	generateRandomAnimal()
	e.preventDefault()
})













