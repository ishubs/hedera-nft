import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction }  from "@hashgraph/sdk";


export default async function environmentSetup() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = "0.0.4854868";
    const myPrivateKey = "3030020100300706052b8104000a04220420834e2c6051286c1e2a47821e7cebf64e8e9780dc33c60d257ba0c85a0f796675";

   // If we weren't able to grab it, we should throw a new error
   if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
  }
  
  //Create your Hedera Testnet client
  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);

  //Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(100));

  //Set the maximum payment for queries (in Hbar)
  client.setDefaultMaxQueryPayment(new Hbar(50));

  return client;
  console.log("Client setup complete.");
}
