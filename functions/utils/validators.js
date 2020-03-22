//helpers for validation
const isEmpty = (string) => {
  if(string.trim() === ''){
    return true;
  }else {
    return false;
  }
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regEx)) {
    return true;
  }else {
    return false;
  }
};

//validate sing up data
exports.validateSignUp = (data) => {

  let errors = {};

  if(isEmpty(data.email)){
    errors.email = 'must not be empty';
  }else if(!isEmail(data.email)){
    errors.email = 'must be a valid email address';
  }

  if(isEmpty(data.password)) {
    errors.password = 'must not be empty';
  }
  if(data.password !== data.confirmPassword){
    errors.confirmPassword = 'passwords do not match';
  }
  if(isEmpty(data.handle)) {
    errors.handle = 'must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

//validate login
exports.validateLogin = (data) => {
  let errors = {};

  if(isEmpty(data.email)) {
    errors.email = 'must not be empty';
  }

  if(isEmpty(data.password)) {
    errors.password = 'must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
