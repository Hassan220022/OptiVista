export constisEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export constisStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };
  
  export constisNonEmptyString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };
  
  export constisPositiveInteger = (value) => {
    return Number.isInteger(value) && value > 0;
  };
  