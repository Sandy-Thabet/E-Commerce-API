const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const merchantCategoryService = require('../../services/Categories/merchant-category-service');

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await merchantCategoryService.getCategory(req.params.id);

  return res.status(200).json(new SuccessResponse(category));
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await merchantCategoryService.getAllCategories(
    req.query.size,
    req.query.page
  );

  return res
    .status(200)
    .json(new SuccessResponse({ results: categories.length, categories }));
});
