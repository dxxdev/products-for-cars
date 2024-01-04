import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addCartProduct, options, products, viewProduct } from "../data/data";
import { styles } from "../styles";
import { ToastContainer } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import {
  AddShoppingCartOutlined,
  Bookmark,
  BookmarkBorderOutlined,
  RemoveShoppingCartOutlined,
  Star,
} from "@mui/icons-material";
import { Button, Chip, IconButton, Typography } from "@material-tailwind/react";
import Products from "../components/Products";
import Questions from "../components/Questions";

const Category = ({ rendered }) => {
  const { category } = useParams();
  const [render, setRender] = useState(true);
  const [filterCategory, setFilterCategory] = useState([]);
  const [inOrder, setInOrder] = useState(null);

  const filteredCategory = products.filter((product) => {
    return product.category == category;
  });
  useEffect(() => {
    document.title = category;
  }, [category]);

  useEffect(() => {
    setFilterCategory(filteredCategory);
  }, [category]);

  const filteredPrice = () => {
    const clonedCategory = [...filteredCategory];

    if (inOrder) {
      clonedCategory.sort((a, b) => a.price - b.price);
    } else if (!inOrder) {
      clonedCategory.sort((a, b) => b.price - a.price);
    }

    setFilterCategory([...clonedCategory]);
  };

  const productSaved = (product) => {
    product.saved = !product.saved;
  };

  return (
    <div className={`${styles.container}`}>
      <div className="py-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 justify-between items-center">
        <Typography variant="h3">{filteredCategory[0].category}</Typography>
        <Button
          onClick={() => {
            setInOrder(inOrder == null ? !inOrder : !inOrder);
            filteredPrice();
          }}
          variant="outlined"
        >
          {inOrder
            ? "Narxlar o'sish tartibida"
            : inOrder == null
            ? "Saralash"
            : "Narxkar kamayish tartibida"}
        </Button>
      </div>
      <ul
        className={`${styles.container} !px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 lg:gap-7 overflow-auto products-swiper`}
      >
        {filterCategory.map((product) => {
          return (
            <li
              key={product.id}
              className="rounded-lg bg-white flex group flex-col shadow-md space-y-4 card-swiper relative"
            >
              <Link
                onClick={() => viewProduct(product)}
                to={`/${product.category}/${product.productName}`}
              >
                <div className="h-[450px] lg:h-[400px] sceleton-animation rounded-t-lg overflow-hidden">
                  <Swiper
                    effect="fade"
                    pagination={{
                      clickable: true,
                    }}
                    loop={true}
                    modules={[Pagination, EffectFade]}
                    className="mySwiper relative rounded-t-lg w-full h-full"
                  >
                    {product.images.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <img src={item} className="w-full h-full" alt={product.productName} />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </Link>
              <div className="flex space-x-3 absolute left-3 top-0 z-10">
                {product.isItNew && (
                  <Chip
                    className="transition-all duration-200 group-hover:bg-opacity-0 group-hover:text-opacity-0"
                    value="Yangi"
                    color="green"
                    size="sm"
                    variant="filled"
                  />
                )}
                {product.inAction && (
                  <Chip
                    className="transition-all duration-200 group-hover:bg-opacity-0 group-hover:text-opacity-0"
                    value="Aksiya"
                    size="sm"
                    variant="filled"
                    color="red"
                  />
                )}
              </div>
              <button
                onClick={() => {
                  setRender((prev) => !prev);
                  product.saved = !product.saved;
                }}
                className="absolute top-0 -translate-y-1/2 right-0 z-[999] text-red-600"
              >
                {product.saved ? (
                  <Bookmark fontSize="large" />
                ) : (
                  <BookmarkBorderOutlined fontSize="large" />
                )}
              </button>
              <div className="flex flex-col h-full px-3 pb-3 space-y-3 relative justify-between">
                <Typography variant="h5" className="font-medium">
                  {product.productName}
                </Typography>
                <div>
                  <div className="flex justify-between items-center py-3">
                    <Typography variant="small">
                      Turkum: {product.category}
                    </Typography>
                    <Typography variant="small" color="black">
                      <span className="flex items-end justify-start space-x-1">
                        <Star className="text-yellow-700" />
                        <span className="text-gray-700">{product.rating}</span>
                      </span>
                    </Typography>
                  </div>
                  <div className="w-full flex justify-between items-end">
                    <Typography variant="h6">
                      {product.price
                        .toLocaleString("uz-UZ", options)
                        .replaceAll(",", " ")}{" "}
                      so'm
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setRender((prev) => !prev);
                        addCartProduct(product);
                      }}
                      variant={`${product.inTheCart ? "filled" : "outlined"}`}
                      color="gray"
                    >
                      {product.inTheCart ? (
                        <RemoveShoppingCartOutlined />
                      ) : (
                        <AddShoppingCartOutlined />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <ToastContainer />
      </ul>
      <section>
        <div className="py-2">
          <Typography variant="h4">Sizga yoqishi mumkin</Typography>
        </div>
        <ul
          className={`${styles.container} !px-0 py-3 flex justify-start overflow-auto gap-5 products-swiper`}
        >
          {products.map((product) => {
            if (product.recommend) {
              return (
                <Products
                  rendered={rendered}
                  product={product}
                  productId={product.id}
                  productName={product.productName}
                  productCategory={product.category}
                  productImages={product.images}
                  productSaved={productSaved}
                  productIsItNew={product.isItNew}
                  productInAction={product.inAction}
                  productRating={product.rating}
                  productPrice={product.price}
                  productInTheCart={product.inTheCart}
                />
              );
            }
          })}
        </ul>
      </section>
      <Questions />
    </div>
  );
};

export default Category;
