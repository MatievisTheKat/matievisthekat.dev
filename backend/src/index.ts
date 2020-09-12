import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import { join } from "path"

const app = express()

app.use(morgan("dev"))
app.use(express.static(join(__dirname, "../public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
