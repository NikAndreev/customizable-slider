document.addEventListener('DOMContentLoaded', function(){

	const slider = document.querySelector('.slider');
	const sliderTrack = slider.querySelector('.slider__track');
	const slideGroup = slider.querySelectorAll('.slider__item');

	const sliderDotsArea = slider.querySelector('.slider__dot-group');
	const sliderDotArray = [];

	slideGroup.forEach( () => {
		const sliderDot = document.createElement('li');
		sliderDot.className='slider__dot';
		sliderDotArray.push(sliderDot);
	});

	sliderDotsArea.append(...sliderDotArray);

	const arrowNext = slider.querySelector('.slider__arrow_next');
	const arrowPrevious = slider.querySelector('.slider__arrow_previous');

	const sliderData = {
		slide_index: 0,
		swipe_data : {
			mouse_down_x: 0,
			mouse_up_x: 0
		}
	}

	highlightDots();

	arrowNext.addEventListener('click', toNextSlide);

	arrowPrevious.addEventListener('click', toPreviousSlide);

	sliderDotArray.forEach( (dot, dotIndex) => {
		dot.addEventListener('click', () => {
			sliderData.slide_index = dotIndex;
			scroll();
			highlightDots();
		});
	});

	slider.addEventListener('wheel', event => {
		event.preventDefault();
		event.deltaY > 0 ? toNextSlide() : toPreviousSlide();
	});

	slider.addEventListener('mousedown', (event) => {
		sliderData.swipe_data.mouse_down_x = event.clientX;
	});

	slider.addEventListener('mouseup', (event) => {
		sliderData.swipe_data.mouse_up_x = event.clientX;

		handleSwipe();
	});


	slider.addEventListener('touchstart', event => {
		sliderData.swipe_data.mouse_down_x = event.touches[0].clientX;
	});

	slider.addEventListener('touchend', event => {
		sliderData.swipe_data.mouse_up_x = event.changedTouches[0].clientX;

		handleSwipe();
	});

	function checkSwipe() {
		return Math.abs(sliderData.swipe_data.mouse_down_x - sliderData.swipe_data.mouse_up_x) > 50
	}

	function handleSwipe() {
		if (checkSwipe()) {
			sliderData.swipe_data.mouse_down_x > sliderData.swipe_data.mouse_up_x ? toNextSlide() : toPreviousSlide();
		}
	}

	function highlightDots() {
		sliderDotArray.forEach( (dot, dotIndex) => {
			if (sliderData.slide_index === dotIndex) {
				dot.classList.add('active');
			} else {
				dot.classList.remove('active');
			}
		})
	}

	function scroll() {
		sliderTrack.style = `transform: translate(-${(100 * sliderData.slide_index)}%, 0)`;
	}

	function toNextSlide() {
		if (sliderData.slide_index < slideGroup.length - 1) {
			sliderData.slide_index++;
			scroll();
			highlightDots();
		}
	}

	function toPreviousSlide() {
		if (sliderData.slide_index > 0) {
			sliderData.slide_index--;
			scroll();
			highlightDots();
		}
	} 
	
});