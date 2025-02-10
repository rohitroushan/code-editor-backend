import express,{Request,Response} from "express";
import runRoutes from './routes/run.route'
import cors from "cors";
import bodyParser from 'body-parser'
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 3001;
app.use(bodyParser.json({limit: '50mb'}));
let origins:string[] = ['https://code-editor-frontend-omega.vercel.app'];
app.use(cors({origin: origins,credentials: true }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use("/run", runRoutes);
app.get("/", (req:Request, res:Response) => {
  res.send("Hello user");
});
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
