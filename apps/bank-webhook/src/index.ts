import db from '@repo/db/client';
import express from 'express';
import * as z from 'zod';
const app = express();

app.use(express.json());

app.post('/hdfcwebhook', async (req, res) => {

const webhookSchema = z.object({
  token : z.string(),
  userId : z.string(),
  amount : z.number()
})

const parsedData = webhookSchema.safeParse(req.body);

if(!parsedData.success){
  return res.status(400).send("Invalid webhook data");
}
const status = await db.onRampTransaction.findFirst({
  where:{ token : parsedData.data.token }
})

if(status?.status === "Success"){
  return res.status(200).json({ message: 'Webhook already processed'});
}
  try{
   await db.balance.update(
    {
    where :{ userId : parseInt(parsedData.data.userId) },
    data :{ amount :{ increment : parsedData.data.amount }} 
})
  
  await db.onRampTransaction.update({
    where:{ token : parsedData.data.token },
    data:{ status : "Success" }
  })
  res.status(200).json({
    message: 'Webhook received successfully',
  });   
  }catch(err){
    console.log(err);
    
    return res.status(500).send("Internal Server Error");
  }


});
app.listen(3003, ()=>{
  console.log('Bank Webhook listening on port 3003');
})