const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const merchantCategoryService = require('../../services/Categories/merchant-category-service');

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await merchantCategoryService.getCategory(req.params.id);

  return res.status(200).json(new SuccessResponse(category));
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const filter = { name };
  const { totalCategories, categories } =
    await merchantCategoryService.getAllCategories(
      filter,
      req.query.sort,
      req.query.page,
      req.query.sizw
    );

  return res.status(200).json(
    new SuccessResponse({
      total: totalCategories.length,
      results: categories.length,
      categories,
    })
  );
});
