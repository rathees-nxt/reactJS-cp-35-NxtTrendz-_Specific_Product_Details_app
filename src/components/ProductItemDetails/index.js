// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusType = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusType.initial,
    productData: {},
    similarProductData: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormatedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    rating: data.rating,
    brand: data.brand,
    description: data.description,
    availability: data.availability,
    totalReviews: data.totalReviews,
  })

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    this.setState({apiStatus: apiStatusType.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = ` https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const datas = await response.json()
      console.log(datas)
      const updatedData = this.getFormatedData(datas)
      const updateSimilarProducts = datas.similar_products.map(eachData =>
        this.getFormatedData(eachData),
      )
      this.setState({
        productData: updatedData,
        similarProductData: updateSimilarProducts,
        apiStatus: apiStatusType.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusType.failure})
    }
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, similarProductData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      brand,
      description,
      availability,
      totalReviews,
    } = productData
    return (
      <div className="product-details-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product">
            <h1 className="title-heading">{title}</h1>
            <p className="price-para">Rs {price}/-</p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating-para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="para-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="hr-rule" />
            <div className="quantity-container">
              <button
                type="button"
                onClick={this.onDecrementQuantity}
                data-testid="minus"
                className="quantity-button"
              >
                <BsDashSquare className="quantity-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                onClick={this.onIncrementQuantity}
                data-testid="plus"
                className="quantity-button"
              >
                <BsPlusSquare className="quantity-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductData.map(eachData => (
            <SimilarProductItem key={eachData.id} similarDetails={eachData} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusType.success:
        return this.renderProductDetailsView()
      case apiStatusType.failure:
        return this.renderFailureView()
      case apiStatusType.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
