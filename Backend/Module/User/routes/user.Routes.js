import {Router} from 'express'
import * as controller from '../controller/userController.js'
import * as controllerAddress from '../controller/userAddress.controller.js'
import { authenticate, isAdmin } from '../Middleware/authenticate.js'
import { singleUpload } from '../../../Common/Middleware/multer.js'

const router = Router()

router.post("/register",controller.register)
router.post("/verify",controller.verify)
router.post("/reVerify",controller.reVerify)
router.post("/login",controller.login)
router.post("/google",controller.googleLogin)
router.post("/logout",authenticate,controller.logout)
router.post("/forgotPassword",controller.forgotPassword)
router.post("/verifyOtp/:email",controller.verifyOtp)
router.post("/allUsers",authenticate,isAdmin,controller.allUsers)
router.post("/getUserById/:userId",authenticate,controller.getUserById)
router.post("/updateProfile/:id",authenticate,singleUpload,controller.updateUser)

// 
router.get("/getAddress/:userId", authenticate, controllerAddress.getAddress)
router.post("/addAddress/:userId", authenticate, controllerAddress.addAddress)
router.post("/updateAddress/:addressId", authenticate, controllerAddress.updateAddress)

export default router


