document.addEventListener('DOMContentLoaded', function(){
	
	class Slider {
		#slideIndex = 0
		#sliderEl
		#trackEl
		#slidesCount
		#paginationActive
		#paginationClickable
		#paginationEl
		#bulletsEl = []
		#bulletActiveClass
		#navigationActive
		#nextEl
		#prevEl
		#mousewheel
		#swipe
		#downX
		#upX
		#keyboard

		constructor(slider, config) {
			this.#sliderEl = slider
			this.#trackEl = this.#sliderEl.querySelector(config.track)
			this.#slidesCount = this.#sliderEl.querySelectorAll(config.slide).length

			this.#paginationActive = config.pagination.active
			if (this.#paginationActive) {
				this.#paginationEl = this.#sliderEl.querySelector(config.pagination.el)

				for (let i = 0; i < this.#slidesCount; i++) {
					const bullet = document.createElement(config.pagination.bulletTag)
					bullet.classList.add(config.pagination.bulletClass)
					bullet.dataset.index = i
					this.#bulletsEl.push(bullet)
				}

				this.#paginationEl.append(...this.#bulletsEl)

				this.#bulletActiveClass = config.pagination.bulletActiveClass

				this.#highlightBullets()

				this.#paginationClickable = config.pagination.clickable
				if (this.#paginationClickable) {
					this.#paginationEl.addEventListener('click', event => {
						if (event.target.closest('[data-index]')) {
							this.#slideIndex = Number(event.target.closest('[data-index]').dataset.index)
							this.#scroll()
							this.#highlightBullets()
						}
					})
				}
			}

			this.#navigationActive = config.navigation.active
			if (this.#navigationActive) {
				this.#nextEl = this.#sliderEl.querySelector(config.navigation.nextEl)
				this.#prevEl = this.#sliderEl.querySelector(config.navigation.prevEl)

				this.#nextEl.addEventListener('click', ()=> this.next())
				this.#prevEl.addEventListener('click', ()=> this.previous())
			}

			this.#mousewheel = config.mousewheel
			if (this.#mousewheel) {
				this.#sliderEl.addEventListener('wheel', event => {
					event.preventDefault()
					event.deltaY > 0 ? this.next() : this.previous()
				})
			}

			this.#swipe = config.swipe
			if (this.#swipe) {
				this.#sliderEl.addEventListener('mousedown', event => {
					this.#downX = event.clientX
				})

				this.#sliderEl.addEventListener('mouseup', event => {
					this.#upX = event.clientX

					this.#doSwipe()
				})

				this.#sliderEl.addEventListener('touchstart', event => {
					this.#downX = event.touches[0].clientX
				})
				
				this.#sliderEl.addEventListener('touchend', event => {
					this.#upX = event.changedTouches[0].clientX
			
					this.#doSwipe()
				})
			}

			this.#keyboard = config.keyboard
			if (this.#keyboard) {
				document.addEventListener('keydown', event => {
					if (event.code === 'ArrowLeft') {
						this.previous()
						return
					}

					if (event.code === 'ArrowRight') {
						this.next()
					}
				})
			}
		}

		#scroll() {
			this.#trackEl.style = `transform: translate(-${(100 * this.#slideIndex)}%, 0)`
		}

		#highlightBullets() {
			if (this.#paginationActive) {
				this.#bulletsEl.forEach( bullet => {
					this.#slideIndex === Number(bullet.dataset.index) ? bullet.classList.add(this.#bulletActiveClass) : bullet.classList.remove(this.#bulletActiveClass)
				})
			}
		}

		#doSwipe() {
			if (Math.abs(this.#downX - this.#upX) > 50) {
				this.#downX > this.#upX ? this.next() : this.previous()
			}
		}

		next() {
			if (this.#slideIndex < this.#slidesCount - 1) {
				this.#slideIndex++
				this.#scroll()
				this.#highlightBullets()
			}
		}
		
		previous() {
			if (this.#slideIndex > 0) {
				this.#slideIndex--
				this.#scroll()
				this.#highlightBullets()
			}
		} 
	}

	new Slider(document.querySelector('[data-slider]'), {
		track: '[data-track]',
		slide: '[data-slide]',
		pagination: {
			active: true,
			el: '[data-pagination]',
			clickable: true,
			bulletTag: 'li',
			bulletClass: 'slider__dot',
			bulletActiveClass: 'active'
		},
		navigation: {
			active: true,
			nextEl: '[data-next]',
			prevEl: '[data-previous]'
		},
		mousewheel: true,
		swipe: true,
		keyboard: true
	})
})
