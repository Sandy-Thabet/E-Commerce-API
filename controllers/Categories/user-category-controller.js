const { catchAsync } = require('../../utils/catchAsync');
const userCategoryService = require('../../services/Categories/user-category-service');
const SuccessResponse = require('../../utils/successResponse');

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await userCategoryService.getCategory(req.params.id);

  return res.status(200).json(new SuccessResponse(category));
});

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const categories = await userCategoryService.getAllCategory(
    req.query.page,
    req.query.size
  );

  return res
    .status(200)
    .json(new SuccessResponse({ results: categories.length, categories }));
});
