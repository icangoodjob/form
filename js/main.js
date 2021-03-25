// Строгий режим use strict
"use strict"

document.addEventListener('DOMContentLoaded', function (){
	const form = document.getElementById('form');
	// При отправке формы мы должны перейти в фунцию formSend
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		// Запрещаем стандартную отправку формы
		e.preventDefault();
		// Валидация формы (проверка заполненности всех полей/ присутствия @ и точки в поле ввода email)
		let error = formValidate(form);


		// ОТПРАВКА ФОРМЫ
		// С помощью этйо строки вытягиваем все данные с полей 
		let formData = new FormData(form);
		// Здесь добавляем изображение, полученное при обработке (код внизу)
		formData.append('image', formImage.files[0]);

		// Делаем проверку (после return error;)
		if (error === 0){
			// "Нужно сообщить пользователю что идет отправка. Убедились, что ошибок в валидации нет - добавляем к форме класс _sending, с которым будем взаимодействовать в файле стилей"
			form.classList.add('_sending');
			// КОГДА ФОРМА ПРОШЛА ВАЛИДАЦИЮ делаем отправку с помощью Ajax, а именно с помощью fetch
			// Отправка методом POST данных (formData), которые мы вытянули в файл sendmail.php
			
			let response = await fetch('sendmail.php',{
				method: 'POST',
				body: formData
			});
			// НУЖНО ПОЛУЧИТЬ ОТВЕТ - успешна ли отправка или нет
			// Файл sendmail.php будет возвращать json ответ
			// Если все OK (response.ok) мы этот ответ будем получать
			if (response.ok){
				let result = await response.json();
				alert(result.message);
				// Чистка полей после отправления
				// Очистка div с превью изображением
				formPreview.innerHTML = '';
				// Очистка всех полей form
				form.reset();
				form.classList.remove('_sending');
			// Если что-то пошло не так - выводим пользователю сообщение с ошибкой
			} else{
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля');
		}
	}

	function formValidate(form){
		let error = 0;
		// Присваем тем объектам, у которых класс _req - обязательное заполнение
		let formReq = document.querySelectorAll('._req');
		// Создание цикла (бегать по объектам, получать в const input и дальше с ней работать)
		for(let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			// Изначально убираем у объекта класс _error
			formRemoveError(input);
			// Начинаем проверку
			if(input.classList.contains('_email')){
				if (emailTest(input)) {
					// Будем добавлять объекту и его родителю класс error
					formAddError(input);
					// Будем увеличивать на единицу нашу переменную
					error++;
				}
				// Будем проверять наличие checkbox
			} else if(input.getAttribute("type") === "checkbox" && input.checked === false){
				// Будем добавлять объекту и его родителю класс _error
				formAddError(input);
				// Будем увеличивать на единицу нашу переменную
				error++;
				// Будем проверять заполнено ли поле вообще
			} else {
				if(input.value === ''){
					formAddError(input);
					error++;
				}
			}
		}
		// Из функции formValidate вернуть значение error
		return error;
	}


	// Вспомогательные функции
	// Добавление самому объекту и родительскому объекту класс _error
	function formAddError(input){
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	// Убрать у самого объекта и родительского объекта класс _error
	function formRemoveError(input){
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}
	// Функция теста email (на соответствие введенных символов)
	function emailTest(input){
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}


	// Работа с preview - возможность видеть фотографию при ее добавлении

	// Получаем инпут file в переменную
	const formImage = document.getElementById('formImage');
	// Получаем div для превью в переменную
	const formPreview = document.getElementById('formPreview');

	// Слушаем изменения в инпуте file
	formImage.addEventListener('change', () =>{
		uploadFile(formImage.files[0]);
	});

	// Создаем функцую с двумя проверками
	function uploadFile(file) {
	// 1. Проверка на тип файла
	if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)){
		alert('Разрешены только изображения');
		formImage.value = '';
		return;
	}
	// 2. Проверка размера файла (<2 Мб)
	if (file.size > 2 * 1024 * 1024) {
		alert('Файл должен быть менее 2 Мб');
		return;
		}
		// Если проверки пройдены, то выводим пользовfтелю файл в качестве превью
		var reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
		};
		reader.onerror = function (e) {
			alert('Ошибка');
		};
		reader.readAsDataURL(file);
	}
});