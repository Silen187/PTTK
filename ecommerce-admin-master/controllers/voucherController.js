const {
  getVouchers,
  getVoucherDetails,
  addVoucherToCustomer,
  deleteVoucher,
  createVoucher,
} = require("../middleware/voucherMiddleware");

exports.getVouchers = async (req, res) => await getVouchers(req, res);
exports.getVoucherDetails = async (req, res) => await getVoucherDetails(req, res);
exports.addVoucherToCustomer = async (req, res) => await addVoucherToCustomer(req, res);
exports.deleteVoucher = async (req, res) => await deleteVoucher(req, res);
exports.createVoucher = async (req, res) => await createVoucher(req, res);
