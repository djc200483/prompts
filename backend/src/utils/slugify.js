const slugify = require('slugify');

function createSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true, // Remove special characters
    trim: true
  });
}

function ensureUniqueSlug(slug, existingSlugs = []) {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

module.exports = {
  createSlug,
  ensureUniqueSlug
};
