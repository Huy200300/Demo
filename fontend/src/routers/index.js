import TypeProduct from "../pages/TypeProductPage/TypeProductPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProductDetails from "../pages/ProductDetailPage/ProductDetailPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSucess from "../pages/OrderSucess/OrderSucess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";

export const routers = [
    {
        path : '/',
        page : HomePage,
        isShowHeader : true,
    },
    {
        path : '/order',
        page : OrderPage,
        isShowHeader : true,
    },
    {
        path : '/payment',
        page : PaymentPage,
        isShowHeader : true,
    },
    {
        path : '/order-success',
        page : OrderSucess,
        isShowHeader : true,
    },
    {
        path : '/my-order',
        page: MyOrderPage,
        isShowHeader : true,
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader : true,
    },
    {
        path : '/product',
        page : ProductPage,
        isShowHeader : true,
    },
    {
        path : '/product/:type',
        page : TypeProduct,
        isShowHeader : true,
    },
    {
        path : '/sign-in',
        page : SignInPage,
        isShowHeader : true,
    },
    {
        path : '/sign-up',
        page : SignUpPage,
        isShowHeader : true,
    },
    {
        path : '/profile-user',
        page : ProfilePage,
        isShowHeader : true,
    },
    {
        path : '/product-details/:type/:name/:id',
        page : ProductDetails,
        isShowHeader : true,
    },
    {
        path : '/system/admin',
        page : AdminPage,
        isShowHeader : false,
        isPrivate : true,
    },
    {
        path : '*',
        page : NotFoundPage
    },
]