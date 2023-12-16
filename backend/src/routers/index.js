const useRouter = require('./userRouter');
const productRouter = require('./productRouter');
const orderRouter = require('./orderRouter');

const router = (app) =>{
    app.use('/api/user',useRouter);
    app.use('/api/product',productRouter);
    app.use('/api/order',orderRouter);
};


module.exports = router;