import {Router} from 'express'
import * as controller from '../../Product/Controller/cart.controller.js'
import { authenticate, isAdmin } from '../../User/Middleware/authenticate.js'



const router = Router()

router.get("/",authenticate,controller.getCart)
router.post("/add",authenticate,controller.updateCart)
router.post("/update",authenticate,controller.updateQuantity)
router.post("/delete",authenticate,controller.removeFromCart)

export default router


