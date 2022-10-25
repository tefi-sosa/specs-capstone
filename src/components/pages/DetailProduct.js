import { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TailSpin } from 'react-loading-icons'
import classes from './DetailProduct.module.css'
import { addToCart } from '../../store/cartSlice'
// import { addToFavorites, removeFavorite } from '../../store/favSlice'


const DetailProduct = () => {

  const { id } = useParams();  
  const [shoe, setShoe] = useState({})
  const [loading, setLoading] = useState(true)
  const [fav, setFav] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const url = `http://localhost:4040`

    let token = localStorage.getItem('token')
    let userId = localStorage.getItem('userId')  

  const handleAddToFav = (id) => {
    axios
    .post(`${url}/wishlist/${id}`, {userId}, {headers: {authorization: token}})
    .then((res) => {
      // console.log('ADDED')
      // console.log(res.data)
      setFav(true)
    })
  }

  const handleDeleteFav = (id) => {
    // console.log(id)
    // console.log(userId)
    axios
      .delete(`${url}/wishlist/${id}`, {headers: {authorization: token},
      params: {
        user: userId
      }})
    .then((res) => {
        // console.log(res.data)
        setFav(false)
    })
  }

  useEffect(() => {
    axios
    .get(`${url}/wishlist`, {
      params: {
      user: userId
    }
  })
    .then((res) => {
        // console.log(res.data)
        const wishlistData = res.data
        wishlistData.forEach((element) => { 
          if (element.product_id === shoe.product_id) {
          setFav(true)
        }
        })

    })
  }, [shoe, fav])

  useEffect(() => {
    axios
        .get(`${url}/product-detail/${id}`)
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
          <img className={classes.detail_img} src={shoe.product_img} alt=''></img>
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
              <div>
                {!token && <i onClick={() => {navigate('/auth')}} className="fa-regular fa-heart fa-xl"></i>}
                {token && (fav ? (
                  <i onClick={() => {handleDeleteFav(shoe.product_id)}} className="fa-solid fa-heart fa-xl"></i>
                ) : (
                  <i onClick={() => {
                    handleAddToFav(shoe.product_id)
                    setFav(false)
                  }} className="fa-regular fa-heart fa-xl"></i>
                ))
                }              
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailProduct