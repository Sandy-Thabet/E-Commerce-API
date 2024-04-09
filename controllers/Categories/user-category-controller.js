const { catchAsync } = require('../../utils/catchAsync');
const userCategoryService = require('../../services/Categories/user-category-service');
const SuccessResponse = require('../../utils/successResponse');

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await userCategoryService.getCategory(req.params.id);

  return res.status(200).json(new SuccessResponse(category));
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const filter = { name };

  const { totalCategories, categories } =
    await userCategoryService.getAllCategories(
      filter,
      req.query.sort,
      req.query.page,
      req.query.size
    );

  return res.status(200).json(
    new SuccessResponse({
      total: totalCategories.length,
      results: categories.length,
      categories,
    })
  );
});
