document.addEventListener('DOMContentLoaded', function(){
	
	class Slider {
		_slideIndex = 0

		constructor(slider, config) {
			this._sliderEl = slider
			this._trackEl = this._sliderEl.querySelector(config.track)
			this._slidesCount = this._sliderEl.querySelectorAll(config.slide).length

			this._paginationActive = config.pagination.active
			if (this._paginationActive) {
				this._paginationEl = this._sliderEl.querySelector(config.pagination.el)

				this._bulletsEl = []
				for (let i = 0; i < this._slidesCount; i++) {
					const bullet = document.createElement(config.pagination.bulletTag)
					bullet.classList.add(config.pagination.bulletClass)
					bullet.dataset.index = i
					this._bulletsEl.push(bullet)
				}

				this._paginationEl.append(...this._bulletsEl)

				this._bulletActiveClass = config.pagination.bulletActiveClass

				this._highlightBullets()

				this._paginationClickable = config.pagination.clickable
				if (this._paginationClickable) {
					this._paginationEl.addEventListener('click', event => {
						if (event.target.closest('[data-index]')) {
							this._slideIndex = Number(event.target.closest('[data-index]').dataset.index)
							this._scroll()
							this._highlightBullets()
							this._lockNavigation()
						}
					})
				}
			}

			this.next = this.next.bind(this)
			this.previous = this.previous.bind(this)

			this._navigationActive = config.navigation.active
			if (this._navigationActive) {
				this._nextEl = this._sliderEl.querySelector(config.navigation.nextEl)
				this._prevEl = this._sliderEl.querySelector(config.navigation.prevEl)

				this._lockNavigation()

				this._nextEl.addEventListener('click', this.next)
				this._prevEl.addEventListener('click', this.previous)
			}

			this._mousewheel = config.mousewheel
			if (this._mousewheel) {
				this._sliderEl.addEventListener('wheel', event => {
					event.preventDefault()
					event.deltaY > 0 ? this.next() : this.previous()
				})
			}

			this._swipe = config.swipe
			if (this._swipe) {
				this._sliderEl.addEventListener('mousedown', event => this._downX = event.clientX)

				this._sliderEl.addEventListener('mouseup', event => {
					this._upX = event.clientX

					this._doSwipe()
				})

				this._sliderEl.addEventListener('touchstart', event => this._downX = event.touches[0].clientX)
				
				this._sliderEl.addEventListener('touchend', event => {
					this._upX = event.changedTouches[0].clientX
			
					this._doSwipe()
				})
			}

			this._keyboard = config.keyboard
			if (this._keyboard) {
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

		_scroll() {
			this._trackEl.style = `transform: translate(-${(100 * this._slideIndex)}%, 0)`
		}

		_lockNavigation() {
			if (this._navigationActive) {
				this._slideIndex >= this._slidesCount - 1 ? this._nextEl.setAttribute('disabled', 'disabled') : this._nextEl.removeAttribute('disabled')
				this._slideIndex === 0 ? this._prevEl.setAttribute('disabled', 'disabled') : this._prevEl.removeAttribute('disabled')
			}
		}

		_highlightBullets() {
			if (this._paginationActive) {
				this._bulletsEl.forEach( bullet => {
					this._slideIndex === Number(bullet.dataset.index) ? bullet.classList.add(this._bulletActiveClass) : bullet.classList.remove(this._bulletActiveClass)
				})
			}
		}

		_doSwipe() {
			if (Math.abs(this._downX - this._upX) > 50) {
				this._downX > this._upX ? this.next() : this.previous()
			}
		}

		next() {
			if (this._slideIndex < this._slidesCount - 1) {
				this._slideIndex++
				this._scroll()
				this._highlightBullets()
				this._lockNavigation()
			}
		}
		
		previous() {
			if (this._slideIndex > 0) {
				this._slideIndex--
				this._scroll()
				this._highlightBullets()
				this._lockNavigation()
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
