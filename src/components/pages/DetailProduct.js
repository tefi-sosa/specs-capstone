import { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useParams} from 'react-router-dom'
import { TailSpin } from 'react-loading-icons'
import classes from './DetailProduct.module.css'
import { addToCart } from '../../store/cartSlice'


const DetailProduct = () => {

  const { id } = useParams();  
  const [shoe, setShoe] = useState({})
  const [loading, setLoading] = useState(true)
  // const [fav, setFav] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const url = `http://localhost:4040`
  let imgURL = shoe.product_img
  console.log(shoe)

    let token = localStorage.getItem('token')
    let userId = localStorage.getItem('userId')  

  const handleFavClick = () => {
    axios
    .post(`${url}/wishlist/${id}`, {userId}, {headers: {authorization: token}})
    .then((res) => {
      console.log('ADDED')
    })
  }

  useEffect(() => {
    axios
        .get(`${url}/product-detail/${id}`)
        .then((res) => {
            setShoe(res.data[0])
            setLoading(false)
        })
    
    axios
    .get(`${url}/wishlist`)
    .then((res) => {
        setShoe(res.data[0])
        setLoading(false)
    })
  }, [id])

  return (
    <div className='product_container'>
      {loading ? (
        <div>
          <TailSpin stroke="#000000" strokeOpacity={.9} speed={.75} height='5rem' />
          <p>Loading...</p>
        </div>
      ) : (
        <div className={classes.detail_container}>
          <img className={classes.detail_img} src={imgURL} alt=''></img>
          <div className={classes.detail_info}>
            <h2>{shoe.product_name.toUpperCase()}</h2>
            <h3>$ {shoe.product_price}</h3>
            <hr/>
            <p>Description - Lorem ipsum dolor sit amet, eos ex duis omnis, solum doming atomorum vim at. Usu te vero legimus repudiandae. At vix iuvaret honestatis necessitatibus, regione fuisset delicatissimi ut nec. In falli alterum his. Eam forensibus honestatis te, id quo elit perpetua adipiscing.</p>
            <div className={classes.button_div}>
              <button 
                onClick={() => 
                  dispatch(addToCart({
                    id:shoe.product_id, title:shoe.product_name, image:shoe.product_img, price:shoe.product_price
                  }))
                }
              >Add to Cart</button>
              {/* <div>
              <i onClick={() => {
                if(token) {handleFavClick()} else {navigate('/auth')}
              }} className="fa-regular fa-heart fa-xl"></i>                              
              </div> */}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailProduct