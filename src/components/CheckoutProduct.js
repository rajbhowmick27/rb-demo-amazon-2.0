import { PlusIcon, MinusIcon, StarIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, removeFromBasket, selectItems } from "../slices/basketSlice";

const CheckoutProduct = ({
  id,
  title,
  rating,
  price,
  description,
  category,
  image,
  hasPrime,
}) => {
  const dispatch = useDispatch();

  const product = {
    id,
    title,
    price,
    rating,
    description,
    category,
    image,
    hasPrime,
  };

  const addItemToBasket = () => {
    //Sending the product as an action to the REDUX store.. the basket slice
    dispatch(addToBasket(product));
  };

  const removeItemFromBasket = () => {
    //Remove item from basket
    dispatch(removeFromBasket(product));
  };


  const {items} = useSelector(selectItems);

  const index = items.findIndex(basketItem => basketItem.product.title === title);

  return (
    <div className="grid grid-cols-5">
      {/* Left */}
      <Image src={image} height={200} width={200} objectFit="contain" />

      {/* Middle */}
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <div className="mb-5">
          <Currency quantity={price} currency="INR" />
        </div>

        {hasPrime && (
          <div className="flex items-center space-x-2 -mt-5">
            <img
              loading="lazy"
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
          </div>
        )}
      </div>

      {/* right */}
      <div className="flex mx-auto relative mr-5">

        <div className="absolute bottom-2 right-2 flex items-center justify-center h-6 rounded-lg bg-gradient-to-b from-gray-700 to-gray-400 active:from-gray-500">
          <MinusIcon onClick={removeItemFromBasket} className="cursor-pointer p-1 h-6 border-2 border-black rounded-l-md mr-1 bg-gradient-to-b from-gray-700 to-gray-200 active:from-gray-500" />
          {
            index >=0 && 
            <div className="p-1 w-6 flex items-center justify-center font-bold">
              {items[index].cnt}
            </div>
          }
          <PlusIcon onClick={addItemToBasket} className="cursor-pointer p-1 h-6 border-2 border-black rounded-r-md ml-1 bg-gradient-to-b from-gray-700 to-gray-200 active:from-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;


{/* <button className="button" onClick={addItemToBasket}>
          Add to Basket
        </button>
        <button className="button" onClick={removeItemFromBasket}>
          Remove from Basket
        </button> */}
