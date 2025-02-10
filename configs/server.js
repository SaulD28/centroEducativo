"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import courseRoutes from "../src/course/course.routes.js"
import apiLimiter from "../src/middlewares/validar-cant-peticiones.js"

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/studentSystem/v1/auth", authRoutes)
    app.use("/studentSystem/v1/user", userRoutes)
    app.use("/studentSystem/v1/course", courseRoutes)
}

const conectarDB = async () => {
    try{
        await dbConnection()
    }catch (err) {
        console.log(`Conexion a base de datos fallada: ${err}`)
        process.exit(1)
    }
}

export const initServer = () => {
    const app = express();
    try{
        middlewares(app)
        conectarDB()
        routes(app)
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
        })
    }catch (err) {
        console.log(`Iniciacion de servidor fallida ${err}`)
    }
}