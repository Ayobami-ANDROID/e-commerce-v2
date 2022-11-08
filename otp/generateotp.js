const generateOTP = (otp) => {
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };
module.exports = {generateOTP}
// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like 
