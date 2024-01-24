import { Link } from 'react-router-dom'

const Products = () => {
  return (
    <div>
      <Link to="/products/analysis">
        <button>Analysis</button>
      </Link>
    </div>
  )
}

export default Products