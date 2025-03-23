// token - cli_LAPTOP-1OE4QAGK\kaile@LAPTOP-1OE4QAGK_1742467346

import express from 'express';
import {createClient} from '@supabase/supabase-js'
import bodyParser from "body-parser";

// express app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// supabase connection
const supabase = createClient({
  apiKey: process.env.SUPABASE_KEY,
  project: 'https://txgfvqffljglhgfwrwxn.supabase.co'
});

