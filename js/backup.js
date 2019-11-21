// 2)
// кнопка | +user |
//
// таблица:
// #(id)    Имя     Телефон      email      город      адрес    зп    аватар    дата рег.(дата время)    дата обновления
//                                                                                                                          Х (крестик удаляет юзера)
//                                                                                                                 (появляется модальное красивое окно подтверждения)
// модальное окно:
// имя:   2-20 символов
// тел:  хх(ххх-хх-хх)
// email: хх@хх.хх
// Город: required
// Адрес: required
// зп: \d 3-10
// аватар: *загрузить файлы* required
//    кнопка |add|
//
// если данные верные - добавляем в таблицу
// фотку в таблицу тоже загружать (почитать про filereader и base64)
//
// при удалении записи, id последующих записей не изменяется и увеличивается на 1
// после крестика есть еще точка, для изменения данных(после изменения обновляется "дата обновления")
// после нажатия на ок, в окне "изменить", появляется модальное окно, "запись номер ... изменена"
// любое модальное окно пропадает через 3 секунды, либо можно закрыть на крестика
//
// создать страницы, слева можно выбрать 20, 50, 100 или все записи. кнопки со страницами
// можно кликнуть а любую ячейку
// можно сортировать таблицу по id, имени, телефону, email, зп, дата регистрации
//
//
//
// все данные о записях хранить в куки ЛИБО  в localstorage
//
//
// зарплата хранится в белках, можно перевести в доллары, евро
//
// использовтаь bootsrtap 4(таблица и все элементы)













window.onload = function () {
  document.getElementById("sendInput").onclick = function () {
    var validation = [];

    // Проверка имени
    if (inputName.value.length >= 2 && inputName.value.length <= 20) {
      inputName.classList.remove("is-invalid");
      let err = inputName.parentNode.getElementsByClassName("invalid-feedback");
      err.length > 0 ? err[0].remove():0;
      inputName.classList.add("is-valid");
      validation[0] = true;
    } else {
      inputName.classList.remove("is-valid");
      let err = inputName.parentNode.getElementsByClassName("invalid-feedback");
      if (err.length === 0) {
        let div = document.createElement("div");
        div.classList.add("invalid-feedback");
        div.innerText = "Имя должно содержать от 2 до 20 символов.";
        inputName.parentNode.appendChild(div);
      }
      inputName.classList.add("is-invalid");
      validation[0] = false;
    }

    // Проверка телефона
    if (/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(inputPhoneNumber.value)) {
      inputPhoneNumber.classList.remove("is-invalid");
      let err = inputPhoneNumber.parentNode.getElementsByClassName("invalid-feedback");
      err.length > 0 ? err[0].remove():0;
      inputPhoneNumber.classList.add("is-valid");
      validation[1] = true;
      console.log(inputPhoneNumber.value.match(/\d/g).join(''));
    } else {
      inputPhoneNumber.classList.remove("is-valid");
      let err = inputPhoneNumber.parentNode.getElementsByClassName("invalid-feedback");
      if (err.length === 0) {
        let div = document.createElement("div");
        div.classList.add("invalid-feedback");
        div.innerHTML = "Введите номер телефона в международном формате.<br>Например: +375 (29) 123-45-67";
        inputPhoneNumber.parentNode.appendChild(div);
      }
      inputPhoneNumber.classList.add("is-invalid");
      validation[1] = false;
    }

    // Проверка email
    // мой вариант /^(\s*)?\w{3,20}@\w{2,15}.\w{2,10}(\s*)?$/
    if (
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inputEmail.value)) {
      inputEmail.classList.remove("is-invalid");
      let err = inputEmail.parentNode.getElementsByClassName("invalid-feedback");
      err.length > 0 ? err[0].remove():0;
      inputEmail.classList.add("is-valid");
      validation[2] = true;
    } else {
      inputEmail.classList.remove("is-valid");
      let err = inputEmail.parentNode.getElementsByClassName("invalid-feedback");
      if (err.length === 0) {
        let div = document.createElement("div");
        div.classList.add("invalid-feedback");
        div.innerText = "Email должен быть вида xxx@xx.xx";
        inputEmail.parentNode.appendChild(div);
      }
      inputEmail.classList.add("is-invalid");
      validation[2] = false;
    }

    // Проверка города
    if (inputCity.value.length >= 2 && inputCity.value.length <= 25) {
      inputCity.classList.remove("is-invalid");
      let err = inputCity.parentNode.getElementsByClassName("invalid-feedback");
      err.length > 0 ? err[0].remove():0;
      inputCity.classList.add("is-valid");
      validation[3] = true;
    } else {
      inputCity.classList.remove("is-valid");
      let err = inputCity.parentNode.getElementsByClassName("invalid-feedback");
      if (err.length === 0) {
        let div = document.createElement("div");
        div.classList.add("invalid-feedback");
        div.innerText = "Введите город вашего проживания.";
        inputCity.parentNode.appendChild(div);
      }
      inputCity.classList.add("is-invalid");
      validation[3] = false;
    }

    // Проверка адреса
    if (inputCity.value.length >= 2 && inputCity.value.length <= 25) {
      inputCity.classList.remove("is-invalid");
      let err = inputCity.parentNode.getElementsByClassName("invalid-feedback");
      err.length > 0 ? err[0].remove():0;
      inputCity.classList.add("is-valid");
      validation[4] = true;
    } else {
      inputCity.classList.remove("is-valid");
      let err = inputCity.parentNode.getElementsByClassName("invalid-feedback");
      if (err.length === 0) {
        let div = document.createElement("div");
        div.classList.add("invalid-feedback");
        div.innerText = "Введите адрес вашего проживания.";
        inputCity.parentNode.appendChild(div);
      }
      inputCity.classList.add("is-invalid");
      validation[4] = false;
    }
  }
}


function validData(obj) {
// obj = { elem, if, num, innerText}
  if (obj.if) {
    obj.elem.classList.remove("is-invalid");
    let err = obj.elem.parentNode.getElementsByClassName("invalid-feedback");
    err.length > 0 ? err[0].remove():0;
    obj.elem.classList.add("is-valid");
    validation[obj.num] = true;
  } else {
    obj.elem.classList.remove("is-valid");
    let err = obj.elem.parentNode.getElementsByClassName("invalid-feedback");
    if (err.length === 0) {
      let div = document.createElement("div");
      div.classList.add("invalid-feedback");
      div.innerHTML = obj.innerText;
      obj.elem.parentNode.appendChild(div);
    }
    obj.elem.classList.add("is-invalid");
    validation[obj.num] = false;
  }
}
