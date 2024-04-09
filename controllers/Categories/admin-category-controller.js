const categoryService = require('../../services/Categories/admin-category-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await categoryService.createCategory(req.admin.id, name);

  return res.status(201).json(new SuccessResponse(category));
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await categoryService.getCategory(req.params.id);

  return res.status(200).json(new SuccessResponse(category));
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const filter = { name };

  const { categories, totalCategories } =
    await categoryService.getAllCategories(
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
