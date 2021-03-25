<?php 
// Подключаем файлы из папки PHPmailer, чтобы плагин заработал
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\PHPException;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	// Объявляем файл
	$mail =  new PHPMailer(true);
	// Настраиваем кодировку
	$mail->CharSet = 'UTF-8';
	// Подключаем языковой файл
	$mail->setLanguage('ru', 'phpmailer/language/')
	// Включение возможности HTML тегов в письме
	$mail->IsHTML(true);

// От кого письмо
	$mail->setFrom('lex.malyshev97@mail.ru', 'Алекс');
	// Кому отправить
	$mail->addAdress('lxmlshv97@mail.ru');
	// Тема письма
	$mail->Subject = 'Добрый день! Это "Алекс"';


	// Рука
	$hand = "Правая";
	if ($_POST['hand'] == "left"){
		$hand = "Левая";
	}


	// Тело письма

	$body = '<h1>Вам пришло новое сообщение</h1>';
	// Проверка заполняемости полей
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['hand']))){
		$body.='<p><strong>Рука:</strong> '.$hand.'</p>';
	}
	if(trim(!empty($_POST['age']))){
		$body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
	}
	if(trim(!empty($_POST['message']))){
		$body.='<p><strong>Возраст:</strong> '.$_POST['message'].'</p>';
	}

	// Прикрепить файл
	if (!empty($_FILES['image']['tmp_name'])){
		// путь загрузки файла
		$filePath = __DIR__ . "/files" . $_FILES['image']['name'];
		// загрузим файл
		// копируем к себе на сервер, в папку
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			// если удалось скопировать добавляю в тело письма текст "Фото в..."
			$body.='<p><strong>Фото в приложении</strong></p>';
			// также добавляем файл,который прикрепляется и высылается вместе с письмом и будет прикреплен к письму
			$mail->addAttachment($fileAttach);
		}
	}

// Собранную переменную body присваиваем в плагин
	$mail->Body = $body;

	// Отправляем
	// Обработчик отправки
	if (!$mail->send()){
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены';
	}
// Формируем из этого json
	$response = ['message' => $message];

	// И с заголовком json возвращаем в наш JS обратно
	header('Content-type: application/json');
	echo json_encode($response);
 ?>