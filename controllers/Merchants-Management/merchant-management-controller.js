const merchantManagementService = require('../../services/Merchants-Management/merchant-management-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.approveMerchant = catchAsync(async (req, res, next) => {
  const merchant = await merchantManagementService.approveMerchant(
    req.params.id
  );

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.getAllMerchants = catchAsync(async (req, res, next) => {
  const { firstName, lastName, status, email, gender, fullName, national_ID } =
    req.query;
  const filter = {
    firstName,
    lastName,
    status,
    email,
    gender,
    fullName,
    national_ID,
  };

  const { totalMerchants, merchants } =
    await merchantManagementService.getAllMerchants(
      filter,
      req.query.page,
      req.query.size,
      req.query.sort
    );

  return res.status(200).json(
    new SuccessResponse({
      total: totalMerchants.length,
      results: merchants.length,
      merchants,
    })
  );
});

exports.getMerchant = catchAsync(async (req, res, next) => {
  const merchant = await merchantManagementService.getMerchant(req.params.id);

  return res.status(200).json(new SuccessResponse({ merchant }));
});

exports.blockMerchant = catchAsync(async (req, res, status) => {
  const merchant = await merchantManagementService.blockMerchant(req.params.id);

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.deleteMerchant = catchAsync(async (req, res, next) => {
  await merchantManagementService.deleteMerchant(req.params.id);

  return res.status(202).json(new SuccessResponse('deleted.'));
});
