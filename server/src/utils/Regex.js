let regexNames = /^[a-zA-ZæøåÆØÅ\-\s]+$/;
let regexNumber = /^[\d]{8}$/;
let regexEmail = /^[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)*@[\wæøåÆØÅ]+([.]{1}[\wæøåÆØÅ]+)+$/;
let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
let regexRegionId = /^[\d]+$/;

export { regexNames, regexNumber, regexEmail, regexPassword, regexRegionId };
