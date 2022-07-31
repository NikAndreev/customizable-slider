document.addEventListener('DOMContentLoaded', function(){
	
	class Slider {
		slideIndex = 0

		constructor(slider, config) {
			this._sliderEl = slider
			this._trackEl = this._sliderEl.querySelector(config.track)
			this.slidesCount = this._sliderEl.querySelectorAll(config.slide).length

			this._paginationActive = config.pagination.active
			if (this._paginationActive) {
				this._initPagination(config.pagination)
			}

			this.next = this.next.bind(this)
			this.previous = this.previous.bind(this)

			this._navigationActive = config.navigation.active
			if (this._navigationActive) {
				this._initNavigation(config.navigation)
			}

			if (config.mousewheel) {
				this._initMousewheel()
			}

			if (config.swipe) {
				this._initSwipe()
			}

			if (config.keyboard) {
				this._initKeyboard()
			}
		}

		_initPagination(config) {
			this._paginationEl = this._sliderEl.querySelector(config.el)

			this._bulletsEl = []
			for (let i = 0; i < this.slidesCount; i++) {
				const bullet = document.createElement(config.bulletTag)
				bullet.classList.add(config.bulletClass)
				bullet.dataset.index = i
				this._bulletsEl.push(bullet)
			}

			this._paginationEl.append(...this._bulletsEl)

			this._bulletActiveClass = config.bulletActiveClass

			this._highlightBullets()

			this._paginationClickable = config.clickable
			if (this._paginationClickable) {
				this._setPaginationClickHandler()
			}
		}

		_setPaginationClickHandler() {
			this._paginationEl.addEventListener('click', event => {
				if (event.target.closest('[data-index]')) {
					this.slideIndex = Number(event.target.closest('[data-index]').dataset.index)
					this._scroll()
					this._highlightBullets()
					this._lockNavigation()
				}
			})
		}

		_initNavigation(config) {
			this._nextEl = this._sliderEl.querySelector(config.nextEl)
			this._prevEl = this._sliderEl.querySelector(config.prevEl)

			this._navigationDisabledClass = config.disabledClass || 'disabled'

			this._lockNavigation()

			this._setNavigationClickHandler()
		}

		_setNavigationClickHandler() {
			this._nextEl.addEventListener('click', this.next)
			this._prevEl.addEventListener('click', this.previous)
		}

		_initMousewheel() {
			this._sliderEl.addEventListener('wheel', event => {
				event.preventDefault()
				event.deltaY > 0 ? this.next() : this.previous()
			})
		}

		_initSwipe() {
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

		_initKeyboard() {
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

		_scroll() {
			this._trackEl.style = `transform: translate(-${(100 * this.slideIndex)}%, 0)`
		}

		_lockNavigation() {
			if (this._navigationActive) {
				this.slideIndex >= this.slidesCount - 1 ? this._nextEl.classList.add(this._navigationDisabledClass) : this._nextEl.classList.remove(this._navigationDisabledClass)
				this.slideIndex === 0 ? this._prevEl.classList.add(this._navigationDisabledClass) : this._prevEl.classList.remove(this._navigationDisabledClass)
			}
		}

		_highlightBullets() {
			if (this._paginationActive) {
				this._bulletsEl.forEach( bullet => {
					this.slideIndex === Number(bullet.dataset.index) ? bullet.classList.add(this._bulletActiveClass) : bullet.classList.remove(this._bulletActiveClass)
				})
			}
		}

		_doSwipe() {
			if (Math.abs(this._downX - this._upX) > 50) {
				this._downX > this._upX ? this.next() : this.previous()
			}
		}

		next() {
			if (this.slideIndex < this.slidesCount - 1) {
				this.slideIndex++
				this._scroll()
				this._highlightBullets()
				this._lockNavigation()
			}
		}
		
		previous() {
			if (this.slideIndex > 0) {
				this.slideIndex--
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
			prevEl: '[data-previous]',
			disabledClass: 'disabled'
		},
		mousewheel: true,
		swipe: true,
		keyboard: true
	})
})
