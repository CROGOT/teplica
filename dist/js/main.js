
(function () {
  "use strict";
  // Пример стартового JavaScript для отключения отправки форм при наличии недопустимых полей
  // Получите все формы, к которым мы хотим применить пользовательские стили проверки Bootstrap
  var forms = document.querySelectorAll(".needs-validation");

  // Зацикливайтесь на них и предотвращайте отправку
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  // именение размера родителя в зависимости от потомка
  const coordinates__wrap_content=document.querySelector('#resized_block');
  const coordinates__wrap=document.querySelector('.coordinates__wrap');
  //console.log(coordinates__wrap_content);
  const resize_coordinates_div = () => {
    //console.log(coordinates__wrap_content);
    coordinates__wrap.style.height=coordinates__wrap_content.offsetHeight + 'px';
  }
  if (coordinates__wrap && coordinates__wrap_content) {
    resize_coordinates_div();
    window.addEventListener(`resize`, resize_coordinates_div, false);
  }
})();
