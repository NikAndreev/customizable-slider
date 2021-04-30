document.addEventListener("DOMContentLoaded", function(){

	const slider = document.querySelector(".slider");
	const sliderTrack = slider.querySelector(".slider__track");
	const slides = slider.querySelectorAll(".slider__item");

	const sliderDotsArea = slider.querySelector(".slider__dot-group");
	const dotsArray = [];

	slides.forEach( () => {
		let sliderDot = document.createElement("li");
		sliderDot.className="slider__dot";
		dotsArray.push(sliderDot);
	});

	sliderDotsArea.append(...dotsArray);

	const nextArrow = slider.querySelector(".slider__arrow_next");
	const previousArrow = slider.querySelector(".slider__arrow_previous");

	let sliderData = {
		slide_index: 0,
		swipe_data : {
			mouse_down_x: 0,
			mouse_up_x: 0
		}
	}

	highlightDots();

	nextArrow.addEventListener("click", toNextSlide);

	previousArrow.addEventListener("click", toPreviousSlide);

	dotsArray.forEach( (dot, dotsIndex) => {
		dot.addEventListener("click", () => {
			sliderData.slide_index = dotsIndex;
			scroll();
			highlightDots();
		});
	});

	slider.addEventListener("wheel", (event) => {
		event.preventDefault();
		event.deltaY < 0 ? toNextSlide() : toPreviousSlide();
	});

	slider.addEventListener("mousedown", (event) => {
		sliderData.swipe_data.mouse_down_x = event.clientX;
	});

	slider.addEventListener("mouseup", (event) => {
		sliderData.swipe_data.mouse_up_x = event.clientX;

		if (checkSwipe()) {
			sliderData.swipe_data.mouse_down_x > sliderData.swipe_data.mouse_up_x ? toNextSlide() : toPreviousSlide();
		}
	});


	slider.addEventListener("touchstart", event => {
		sliderData.swipe_data.mouse_down_x = event.touches[0].clientX;
	});

	slider.addEventListener("touchend", event => {
		sliderData.swipe_data.mouse_up_x = event.changedTouches[0].clientX;

		if (checkSwipe()) {
			sliderData.swipe_data.mouse_down_x > sliderData.swipe_data.mouse_up_x ? toNextSlide() : toPreviousSlide();
		}
	});

	function checkSwipe() {
		if (Math.abs(sliderData.swipe_data.mouse_down_x - sliderData.swipe_data.mouse_up_x) > 50) {
			return true;
		} else {
			return false;
		}
	}

	function highlightDots() {
		dotsArray.forEach( (dot, dotsIndex) => {
			if (sliderData.slide_index === dotsIndex) {
				dot.classList.add("active");
			} else {
				dot.classList.remove("active");
			}
		})
	}

	function scroll() {
		sliderTrack.style = `transform: translate(-${(100 * sliderData.slide_index)}%, 0)`;
	}

	function toNextSlide() {
		if (sliderData.slide_index < slides.length - 1) {
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

	function autoplay(interval) {
		let directionIndex = 1;
		let steps = slides.length - 1;
		let stepsCounter = 0;

		setInterval(() => {
			stepsCounter++;
			if (directionIndex) {
				toNextSlide();
				directionIndex = (stepsCounter % steps === 0) ? 0 : 1;
			} else {
				toPreviousSlide();
				directionIndex = (stepsCounter % steps === 0) ? 1 : 0;
			}
		} ,interval)
	}

	
});