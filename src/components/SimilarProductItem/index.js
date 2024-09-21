// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarDetails} = props
  const {title, brand, imageUrl, rating, price} = similarDetails
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <p className="para-title">{title}</p>
      <p className="para-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="para-price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="para-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
