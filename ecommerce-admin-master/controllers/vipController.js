const {
  getVipCustomers,
  getVipCustomerDetails,
  updateVipList,
  createVoucherForVip,
  promoteToVip,
  removeVipStatus: removeVipStatusMiddleware, // Đổi tên import để tránh xung đột
} = require("../middleware/vipMiddleware");

exports.getVipCustomers = async (req, res) => {
  await getVipCustomers(req, res);
};

exports.getVipCustomerDetails = async (req, res) => {
  await getVipCustomerDetails(req, res);
};

exports.updateVipList = async (req, res) => {
  await updateVipList(req, res);
};

exports.createVoucherForVip = async (req, res) => {
  await createVoucherForVip(req, res);
};

exports.promoteToVip = async (req, res) => {
  await promoteToVip(req, res);
};

exports.removeVipStatus = async (req, res) => {
  await removeVipStatusMiddleware(req, res); // Sử dụng middleware đúng cách
};
