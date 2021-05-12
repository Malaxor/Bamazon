function checkID(res, value) {
   // item.id is a number, while input value is a string
   return res.some(item => item.id == value);
}
module.exports = checkID;
