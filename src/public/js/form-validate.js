(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

$(".form-control").change((evnt) => {
  const el = evnt.target;
  if (el.name === "bio") return;
  let check = false;
  const genCheck = validateGeneral(el);

  if (el.name === "email") check = validateEmail(el.value);
  else if (el.name === "password" || el.name === "confirmPassword")
    check = validatePassword(el.value);
  else if (el.name === "username") check = validateUsername(el.value);
  else if (el.name === "bio") check = validateBio(el.value);
  else if (el.name === "stars") check = validateReviewStars(el.value);
  else if (el.name === "reviewText") check = validateReviewText(el.value);

  if (!genCheck) {
    el.classList.remove(`is-${genCheck ? "invalid" : "valid"}`);
    el.classList.add(`is-${genCheck ? "valid" : "invalid"}`);
  } else {
    el.classList.remove(`is-${check ? "invalid" : "valid"}`);
    el.classList.add(`is-${check ? "valid" : "invalid"}`);
  }
});

function validateGeneral(el) {
  if (!el.value && el.name !== "bio") return false;
  else return true;
}

function validateEmail(email) {
  const match = email.match(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  if (match && match[0] && !match[1]) return true;
  else return false;
}

function validatePassword(pass) {
  const match = pass.match(
    /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/
  );
  if (match) return true;
  else return false;
}

function validateUsername(username) {
  const match = username.match(/^[a-z0-9_-]{3,20}$/);
  if (match) return true;
  else return false;
}

function validateBio(bio) {
  const words = bio.split(/ +/gi);
  if (words.length > 1000) return false;
  else return true;
}

function validateReviewStars(stars) {
  stars = parseInt(stars);
  if (stars > 5 || stars <= 1) return false;
  else return true;
}

function validateReviewText(text) {
  const words = text.split(/ +/gi);
  console.log(words.length);
  if (words.length <= 10) return false;
  else if (words.length > 1000) return false;
  else return true;
}
