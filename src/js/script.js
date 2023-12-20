'use strict';

window.addEventListener('load', launchAnActions);

function launchAnActions(){
    workWithSlider();
}

function workWithSlider(){
    const slider = document.querySelector('.social__slider');
    const line = document.querySelector('.social__slider-line');
    const images = document.querySelectorAll('.social__slider-img');
    const btnLeft = document.querySelector('.arrow-left');
    const btnRight = document.querySelector('.arrow-right');
    const blockWithCircles = document.querySelector('.social__circles');

    const sliderWidth = slider.offsetWidth; // Ширина слайдера
	let totalWidthImages = 0; // Общая ширина картинок
	let remainderOfLineLength = 0; // Оставшаяся часть ленты в слайдере
	let sumOfTails = 0; // Просмтренные картинки (хвост)
	let action = 0; // Номер действия
	let picSizes = []; // Массив размеров картинок

	// Добавление размеров картинок в массив и вычисление общей ширины
	images.forEach((item, i) => {
		picSizes.push(item.offsetWidth + 25);
		totalWidthImages += picSizes[i];
	});

	// Динамическое добавление точек
	for (let i = 0; i < images.length; i++) {
		let circle = document.createElement('div');
		circle.className = 'circle';
		blockWithCircles.append(circle);
	}

	let circles = blockWithCircles.querySelectorAll('.circle');

	console.log(picSizes);
	console.log(totalWidthImages);

	// Ширина ленты с картинками
	line.style.width = `${totalWidthImages + 30}px`;
	circles[0].classList.add('white');

	// Функция добавления/удаления белой точки
	function addRemoveWhite() {
		circles.forEach((item) => {
			item.classList.remove('white');
		});
		circles[action].classList.add('white');
	}

	// Листание вправо
	btnRight.addEventListener('click', () => {
		if (action + 1 == picSizes.length) {
			action = 0;
			sumOfTails = 0;
			remainderOfLineLength = 0;
			line.style.left = 0;
			addRemoveWhite();
		} else {
			sumOfTails += picSizes[action++];
			remainderOfLineLength = totalWidthImages - sumOfTails - sliderWidth;
			addRemoveWhite();
		}

		if (remainderOfLineLength >= 0) {
			line.style.left = `-${sumOfTails}px`;
		} else {
			line.style.left = `-${totalWidthImages - sliderWidth}px`;
		}
	});

	// Листание влево
	btnLeft.addEventListener('click', () => {
		if (action - 1 == 0) {
			action = 0;
			sumOfTails = 0;
			line.style.left = 0;
			addRemoveWhite();
		} else if (action - 1 < 0) {
			action = picSizes.length - 1;
			sumOfTails = totalWidthImages - sliderWidth;
			remainderOfLineLength = totalWidthImages - sumOfTails - sliderWidth;
			addRemoveWhite();
		} else {
			sumOfTails -= picSizes[action--];
			remainderOfLineLength = totalWidthImages - sumOfTails - sliderWidth;
			addRemoveWhite();
		}

		if (remainderOfLineLength >= 0) {
			line.style.left = `-${sumOfTails}px`;
		} else {
			line.style.left = 0;
		}
	});
}