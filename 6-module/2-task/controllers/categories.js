const Category = require('../models/Category');

const transformCategory = (category) => {
  const newCategory = JSON.parse(JSON.stringify(category));
  newCategory.id = category._id;

  if (category.subcategories) {
    newCategory.subcategories = category.subcategories.map(
        (subcategory) => transformCategory(subcategory)
    );
  }

  delete newCategory['_id'];
  delete newCategory['__v'];
  return newCategory;
};

module.exports.categoryList = async function categoryList(ctx) {
  const categories = await Category.find();

  ctx.body = {
    categories: categories.map((category) => transformCategory(category)),
  };
};
