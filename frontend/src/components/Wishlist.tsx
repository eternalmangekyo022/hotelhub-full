import { Link } from '@tanstack/react-router';
import { useWishlist } from './WishListContext';
import './styles/wishlist.scss';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      <div className="wishlist-items">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img src={item.images[0]?.full} alt={item.name} className="item-image" />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>{item.city}</p>
                <p>${item.price} per night</p>
                <button className="remove-button" onClick={() => removeFromWishlist(item.id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your wishlist is empty. <Link to="/hotels">Explore hotels</Link> to add items to your wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;