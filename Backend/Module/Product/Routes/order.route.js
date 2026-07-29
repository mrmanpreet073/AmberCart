import {Router} from 'express'
import * as controller from '../../Product/Controller/order.controller.js'
import { authenticate, isAdmin } from '../../User/Middleware/authenticate.js'



const router = Router()

router.post("/create-order",authenticate,controller.createOrder)
router.post("/verify-payment",authenticate,controller.verifyPayment)
router.post("/getUserOrders",authenticate,controller.getUserOrder)
router.get("/getDashboard",authenticate,controller.getDashboard)
router.get("/getOrders",authenticate,controller.getAllOrders)
// router.post("/verify-payment",authenticate,controller.verifyPayment)

export default router


