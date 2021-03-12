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

	let slideIndex = 0;

	highlightDots();

	nextArrow.addEventListener("click", toNextSlide);

	previousArrow.addEventListener("click", toPreviousSlide);

	dotsArray.forEach( (dot, dotsIndex) => {
		dot.addEventListener("click", () => {
			slideIndex = dotsIndex;
			toScroll();
			highlightDots();
		});
	});

	slider.addEventListener("wheel", (event) => {
		event.preventDefault();
		event.deltaY < 0 ? toNextSlide() : toPreviousSlide();
	});

	let mouseDownX = 0;
	let mouseUpX = 0;

	slider.addEventListener("mousedown", (event) => {
		mouseDownX = event.clientX;
	});

	slider.addEventListener("mouseup", (event) => {
		mouseUpX = event.clientX;

		if (checkSwipe()) {
			mouseDownX > mouseUpX ? toNextSlide() : toPreviousSlide();
		}
	});


	slider.addEventListener("touchstart", event => {
		mouseDownX = event.touches[0].clientX;
	});

	slider.addEventListener("touchend", event => {
		mouseUpX = event.changedTouches[0].clientX;

		if (checkSwipe()) {
			mouseDownX > mouseUpX ? toNextSlide() : toPreviousSlide();
		}
	});

	function checkSwipe() {
		if (Math.abs(mouseDownX - mouseUpX) > 50) {
			return true;
		} else {
			return false;
		}
	}

	function highlightDots() {
		dotsArray.forEach( (dot, dotsIndex) => {
			if (slideIndex === dotsIndex) {
				dot.classList.add("active");
			} else {
				dot.classList.remove("active");
			}
		})
	}

	function toScroll() {
		sliderTrack.style = `transform: translate(-${(100 * slideIndex)}%, 0)`;
	}

	function toNextSlide() {
		if (slideIndex < slides.length - 1) {
			slideIndex++;
			toScroll();
			highlightDots();
		}
	}

	function toPreviousSlide() {
		if (slideIndex > 0) {
			slideIndex--;
			toScroll();
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