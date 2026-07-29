import {Router} from 'express'
import * as controller from '../../Product/Controller/product.controller.js'
import { authenticate, isAdmin } from '../../User/Middleware/authenticate.js'
import { multiUpload, singleUpload } from '../../../Common/Middleware/multer.js'


const router = Router()

router.post("/addProducts",authenticate,isAdmin,multiUpload,controller.addProduct)
router.get("/allProducts",controller.getAllProducts)
router.get("/homepage",controller.getHomepageProducts)
router.get("/productMeta",controller.getProductMeta)
router.get("/product/:id",controller.getProductById)
router.post("/updateProduct/:id",multiUpload,authenticate,isAdmin,controller.updateProduct)
router.delete("/deleteProduct/:id",authenticate,isAdmin,controller.deleteProduct)

export default router


