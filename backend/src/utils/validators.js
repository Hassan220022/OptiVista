exports.isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  exports.isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };
  
  exports.isNonEmptyString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };
  
  exports.isPositiveInteger = (value) => {
    return Number.isInteger(value) && value > 0;
  };
  