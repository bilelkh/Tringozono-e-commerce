const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const ProductSchema = new Schema({
  // reference to others objects
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  owner:  { type: Schema.Types.ObjectId, ref: 'User'},
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  image: String,
  title: String,
  description: String,
  price: Number,
  created: { type: Date, default: Date.now }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ProductSchema
  .virtual('averageRating')
  .get(function () {
    let rating = 0;
    if (this.reviews.length == 0) {
      rating = 0;
    } else { 
      this.reviews.map((review) => {
        rating += review.rating;
      });
      rating = rating / this.reviews.length;
    }
    return rating;
  });

ProductSchema.plugin(deepPopulate);

module.exports = mongoose.model('Product', ProductSchema);
