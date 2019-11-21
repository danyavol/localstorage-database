// 2)
// кнопка | +user |
//
// таблица:
// #(id)    Имя     Телефон      email      город      адрес    зп    аватар    дата рег.(дата время)    дата обновления
//                                                                                                                          Х (крестик удаляет юзера)
//                                                                                                                 (появляется модальное окно подтверждения)
// модальное окно:
// имя:   2-20 символов
// тел:  хх(ххх-хх-хх)
// email: хх@хх.хх
// Город: required
// Адрес: required
// зп: \d 3-10
//    кнопка |add|
//
// если данные верные - добавляем в таблицу
//
// при удалении записи, id последующих записей не изменяется и увеличивается на 1
// после крестика есть еще точка, для изменения данных(после изменения обновляется "дата обновления")
// после нажатия на ок, в окне "изменить", появляется модальное окно, "запись номер ... изменена"
// любое модальное окно пропадает через 3 секунды, либо можно закрыть на крестика
//
// можно сортировать таблицу по id, имени, телефону, email, зп, дата регистрации
//
//
// все данные о записях хранить в куки ЛИБО  в localstorage
//
//
// зарплата хранится в белках, можно перевести в доллары, евро
//
// использовтаь bootsrtap 4(таблица и все элементы)









window.onload = function() {
   function convertUserToString(id, oldfag=false) {
       // if oldfag == true  ->  regTime не меняется
      let person = {};
      person.id = +id;
      person.name = inputName.value.trim();
      person.phone = inputPhoneNumber.value.match(/\d/g).join('');
      person.email = inputEmail.value.trim();
      person.city = inputCity.value.trim();
      person.address = inputAddress.value.trim();
      person.salary = +inputPay.value.trim();
      let time = new Date();
      time = time.getTime();
      oldfag ? person.regTime = strToObj(localStorage.getItem(id)).regTime : person.regTime = time;
      person.updTime = time;
      let str = JSON.stringify(person);
      return str;
   }
   function clearForm() {
      let form = ['inputName', 'inputPhoneNumber', 'inputEmail', 'inputCity', 'inputAddress', 'inputPay'];
      for (var i = 0; i < form.length; i++) {
         let elem = document.getElementById(form[i]);
         elem.value = '';
         elem.classList.remove('is-valid');
         elem.classList.remove('is-invalid');
         let err = elem.parentNode.getElementsByClassName("invalid-feedback");
         for (var j = 0; j < err.length; j++) {
            err[j].remove();
         }
      }
   }
   function addUserOnScreen(id) {
      id = id + '';
      let obj = JSON.parse(localStorage.getItem(id));
      if (obj === null) return;

      let tr = document.createElement('tr');

      let num = document.querySelectorAll('#mainTable > tbody > tr');
      if (num.length % 2 == 0) {
         tr.classList.add('person-row-ne');
      } else {
         tr.classList.add('person-row-e');
      }

      let objKeys = ['id', 'name', 'phone', 'email', 'city', 'address', 'salary', 'regTime', 'updTime'];
      for (let i = 0; i < objKeys.length+1; i++) {
         let td = document.createElement('td');
         if (i != 7) {
            td.innerText = obj[objKeys[i]];
         }
         if (i > 6 && i < 9) {
             td.innerText = beautifyTime(obj[objKeys[i]]);
         }
         if (i == objKeys.length) {
            td.innerHTML = '<i class="fas fa-trash-alt"></i><i class="fas fa-edit"></i>';
            td.getElementsByClassName('fa-trash-alt')[0].addEventListener('click', removePerson);
            td.getElementsByClassName('fa-edit')[0].addEventListener('click', editUser);
         }
         tr.addEventListener('click', activeRow);
         tr.appendChild(td);
      }
      document.querySelector('#mainTable > tbody').appendChild(tr);
   }
   function updateScreen() {
       // удаление старых строк
      var oldRows = document.querySelector('#mainTable tbody');
      while (oldRows.firstChild) {
          oldRows.firstChild.remove();
      }

      let str = localStorage.getItem('info');
      if (str === null) {
          return;
      }
      let info = strToObj(str);
      let count = info.count;
      if (count != undefined) {
         for (var i = 1; i <= count; i++) {
            addUserOnScreen(i);
         }
      }
   }
   function createSuccessAlert(obj) {
      // obj = {text, expire}
      //
      // <container>
      //   <div1><icon1/></div1>
      //   <div2><icon2></icon2></div2>
      //
      // </conatiner>
      let container = document.createElement('div');
      container.className = 'alert alert-success alert-message fade show d-flex rounded p-0';
      container.role = 'alert';
      container.id = "my-alert";
      let div1 = document.createElement('div');
      div1.className = 'alert-icon d-flex justify-content-center align-items-center flex-grow-0 flex-shrink-0 py-3';
      container.appendChild(div1);
      let icon1 = document.createElement('i');
      icon1.className = 'fas fa-check';
      div1.appendChild(icon1);
      let div2 = document.createElement('div');
      div2.className = 'd-flex align-items-center py-2 px-3';
      div2.innerText = obj.text;
      container.appendChild(div2);
      let a = document.createElement('a');
      a.className = 'close d-flex ml-auto justify-content-center align-items-center px-3';
      a.datadismiss = "alert";
      container.appendChild(a);
      let icon2 = document.createElement('i');
      icon2.className = 'fas fa-times';
      a.appendChild(icon2);

      notification.appendChild(container);

      a.onclick = function() {
         $('#my-alert').alert('close');
      }

      setTimeout(function() {
         $('#my-alert').alert('close');
      }, obj.expire);
   }
   function removePerson() {
      let elem = this.parentNode.parentNode;
      let id = elem.children[0].innerText;
      localStorage.removeItem(id);
      elem.remove();
      createSuccessAlert({
         text: 'Пользователь удален из базы данных',
         expire: 3000
      });
      if (mainTable.children.length == 2) {
          localStorage.setItem('count', 0);
      }
   }
   function editUser() {
       $('#ModallAddUser').modal('show');
       exampleModalCenterTitle.innerText = 'Изменить данные пользователя';
       sendInput.innerText = 'Изменить';

       let id = +this.parentNode.parentNode.children[0].innerText;
       let info = strToObj(localStorage.getItem('info'));
       info.curUserID = id;
       info.userType = 'edit';
       localStorage.setItem('info', objToStr(info));

       let obj = strToObj(localStorage.getItem(id));
       inputName.value = obj.name;
       inputPhoneNumber.value = obj.phone;
       inputEmail.value = obj.email;
       inputCity.value = obj.city;
       inputAddress.value = obj.address;
       inputPay.value = obj.salary;
   }
   function checkIfThereAnyChanges(id) {
       id = id + '';
       let obj = strToObj(localStorage.getItem(id));
       let response = false;
       inputName.value != obj.name ? response = true : 0;
       inputPhoneNumber.value != obj.phone ? response = true : 0;
       inputEmail.value != obj.email ? response = true : 0;
       inputCity.value != obj.city ? response = true : 0;
       inputAddress.value != obj.address ? response = true : 0;
       inputPay.value != obj.salary ? response = true : 0;
       // false = no changes; true = some changes.
       return response;
   }

   function beautifyTime(ms) {
       let time = new Date(ms);
       // 10.08.2019, 22:51:56
       function h(num) {
           if (num <= 9) {
               return '0' + num;
           } else return num;
       }
       return `${h(time.getDate())}.${h(time.getMonth() + 1)}.${time.getFullYear()},   ${h(time.getHours())}:${h(time.getMinutes())}:${h(time.getSeconds())}`;
   }

   function strToObj(str) {
       return JSON.parse(str);
   }
   function objToStr(obj) {
       return JSON.stringify(obj);
   }

   function activeRow() {
       var elems = document.querySelectorAll('#mainTable tbody tr');
       for (var i = 0; i < elems.length; i++) {
           if (elems[i] != this) {
               elems[i].classList.remove('color-active');
           }
       }
       this.classList.toggle('color-active');
   }

   function sortItem() {
       function sort(array, type=false) {
           // array = [[1,'hi'],[2,'hello'], ...];
           if (type) {
               for (let i = 0; i < array.length-1; i++) {
                   for (let j = i+1; j < array.length; j++) {
                       if (array[i][1] < array[j][1]) {
                           let t = array[i];
                           array[i] = array[j];
                           array[j] = t;
                       }
                   }
               }
           } else{
               for (let i = 0; i < array.length-1; i++) {
                   for (let j = i+1; j < array.length; j++) {
                       if (array[i][1] > array[j][1]) {
                           let t = array[i];
                           array[i] = array[j];
                           array[j] = t;
                       }
                   }
               }
           }

       }
       // сброс других сортировок
       for (var i = 0; i < sortButs.length; i++) {
           if (sortButs[i] != this) {
               sortButs[i].classList.remove('fa-sort-amount-up');
               sortButs[i].classList.remove('fa-sort-amount-down-alt');
               sortButs[i].classList.add('fa-sort');
           }
       }

       var itemsToSort = [];
       var sortType = this.getAttribute('sort');

       let elems = document.querySelectorAll('#mainTable tbody tr td:first-child');
       for (var i = 0; i < elems.length; i++) {
           itemsToSort.push(strToObj(localStorage.getItem(elems[i].innerText)));
       }



       if (this.classList.contains('fa-sort') || this.classList.contains('fa-sort-amount-up')) {
           // Сортировка по возрастанию
           this.classList.remove('fa-sort');
           this.classList.remove('fa-sort-amount-up');
           this.classList.add('fa-sort-amount-down-alt');

           let array = [];
           for (var i = 0; i < itemsToSort.length; i++) {
               if (typeof(itemsToSort[0][sortType]) === 'string') {
                   array.push([itemsToSort[i]['id'],itemsToSort[i][sortType].toLowerCase()]);
               } else {
                   array.push([itemsToSort[i]['id'],itemsToSort[i][sortType]]);
               }
           }

           sort(array);

           while (tbody.firstChild) {
               tbody.firstChild.remove();
           }

           for (var i = 0; i < array.length; i++) {
               addUserOnScreen(array[i][0]);
           }



       } else if (this.classList.contains('fa-sort-amount-down-alt')) {
           // Сортировка по убыванию
           this.classList.remove('fa-sort-amount-down-alt');
           this.classList.add('fa-sort-amount-up');

           let array = [];
           for (var i = 0; i < itemsToSort.length; i++) {
               if (typeof(itemsToSort[0][sortType]) === 'string') {
                   array.push([itemsToSort[i]['id'],itemsToSort[i][sortType].toLowerCase()]);
               } else {
                   array.push([itemsToSort[i]['id'],itemsToSort[i][sortType]]);
               }
           }

           sort(array, true);

           while (tbody.firstChild) {
               tbody.firstChild.remove();
           }

           for (var i = 0; i < array.length; i++) {
               addUserOnScreen(array[i][0]);
           }

       }
   }



   updateScreen();
   // Кнопка "добавить нового пользователя"
   document.getElementById("but-add-user").onclick = function () {
       exampleModalCenterTitle.innerText = 'Добавить нового пользователя';
       sendInput.innerText = 'Добавить';
       var obj = strToObj(localStorage.getItem('info'));
       obj.userType = 'new';
       obj.curUserID = undefined;
       localStorage.setItem('info', objToStr(obj));
   };

   // добавление нового пользователя
   document.getElementById("sendInput").onclick = function() {
      function validData(obj) {
         // obj = { elem, if, num, innerText}
         if (obj.if) {
            obj.elem.classList.remove("is-invalid");
            let err = obj.elem.parentNode.getElementsByClassName("invalid-feedback");
            err.length > 0 ? err[0].remove() : 0;
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
      var validation = [];

      // Проверка имени
      validData({
         elem: inputName,
         if: (inputName.value.trim().length >= 2 && inputName.value.trim().length <= 20),
         num: 0,
         innerText: "Имя должно содержать от 2 до 20 символов."
      });
      // Проверка телефона
      validData({
         elem: inputPhoneNumber,
         if: (/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(inputPhoneNumber.value)),
         num: 1,
         innerText: "Введите номер телефона в международном формате.<br>Например: +375 (29) 123-45-67"
      });
      // Проверка email
      // мой вариант /^(\s*)?\w{3,20}@\w{2,15}.\w{2,10}(\s*)?$/
      validData({
         elem: inputEmail,
         if: (
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inputEmail.value)),
         num: 2,
         innerText: "Email должен быть вида xxx@xx.xx"
      });
      // Проверка города
      validData({
         elem: inputCity,
         if: (inputCity.value.trim().length >= 2 && inputCity.value.trim().length <= 25),
         num: 3,
         innerText: "Введите город вашего проживания."
      });
      // Проверка адреса
      validData({
         elem: inputAddress,
         if: (inputAddress.value.trim().length >= 2 && inputAddress.value.trim().length <= 25),
         num: 4,
         innerText: "Введите адрес вашего проживания."
      });
      // Проверка зп
      validData({
         elem: inputPay,
         if: (/^(\s*)?\d{3,10}(\s*)?$/.test(inputPay.value)),
         num: 5,
         innerText: "Введите вашу ЗП в бел.руб"
      });



      var access = true;
      for (var i = 0; i < validation.length; i++) {
         validation[i] === false ? access = false : 0;
      }
      if (access) {
         // если все данные верны
        if (localStorage.getItem('info') != null && strToObj(localStorage.getItem('info')).userType == 'edit') {
            // Изменение пользователя
            let info = strToObj(localStorage.getItem('info'));
            let id = info.curUserID;
            info.curUserID = undefined;
            info.userType = 'new';
            if (checkIfThereAnyChanges(id)) {
                let str = convertUserToString(id, true);
                localStorage.setItem(id, str);
                localStorage.setItem('info', objToStr(info));

                updateScreen();
                $('#ModallAddUser').modal('hide');
                createSuccessAlert({
                   text: 'Данные пользователя успешно изменены',
                   expire: 3000
                });
            } else $('#ModallAddUser').modal('hide');
        } else {
            // Добавление пользователя
            let info;
            let id;
            if (localStorage.getItem('info') != null) {
                info = strToObj(localStorage.getItem('info'));
                info.count = +info.count + 1;
                id = info.count;
                localStorage.setItem(id, convertUserToString(id));
            } else {
                info = {
                    count: 1,
                    curUserID: undefined,
                    userType: 'new'
                }
                id = info.count;
                localStorage.setItem(id, convertUserToString(id));
            }
            localStorage.setItem('info', objToStr(info));
            addUserOnScreen(id);

            $('#ModallAddUser').modal('hide');
            createSuccessAlert({
               text: 'Пользователь успешно добавлен в базу данных',
               expire: 3000
            });
        }

      }
   }

   document.getElementById("testUser").onclick = function () {
       let x = {"id":1,"name":"Петров Иванов","phone":"3752967330909","email":"ex@ex.ex","city":"Минск","address":"ул.Ленина 10-4","salary":8000,"regTime":1565504674209,"updTime":1565504674209};

       let info;
       let id;
       if (localStorage.getItem('info') != null) {
           info = strToObj(localStorage.getItem('info'));
           info.count = +info.count + 1;
           id = info.count;
           x.id = id;
           localStorage.setItem('info', objToStr(info));
           localStorage.setItem(id, objToStr(x));
           updateScreen();
       } else {
        id = 1;
        localStorage.setItem('info', objToStr({"count": 1}));
        localStorage.setItem(id, objToStr(x));
        updateScreen();
       }
   }

   // сортировка
   var sortButs = document.querySelectorAll('#mainTable thead .sort i');
   for (let i = 0; i < sortButs.length; i++) {
       sortButs[i].addEventListener('click', sortItem);
   }

   // очистка формы после закрытия самой формы
   $('#ModallAddUser').on('hidden.bs.modal', function() {
      clearForm();
   });

}
