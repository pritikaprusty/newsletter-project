const exp=require("express");
const yparser=require("body-parser");
const { status } = require("express/lib/response");
const https = require("https");
const { response } = require("express");
const { dirname } = require("path");
const mailchimp = require("@mailchimp/mailchimp_marketing");

//express module
const app= exp();
app.use(yparser.urlencoded({extended :true}));
app.use(exp.static("public"));
app.get("/",function(req,res){

    //console.log(request);
    res.sendFile(__dirname +"/sign.html");
}); 
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
     apiKey:"faba5703b0e8ed23cf7d94cd576afe10-us14",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
     server: "us14"
    });
app.post("/",function(req,res){

    //console.log(request);
    //console.log(request.body);
    const n1= req.body.fname;
    const n2= req.body.lname;
    const n3= req.body.email;
    const listId="71cab5a5dc";
    //Creating an object with the users data
    const subscribingUser = {
    firstName: n1,
    lastName: n2,
    email: n3
    };
    //Uploading the data to the server
     const run=async () =>  {
        try{


 
        
            const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
            }
            });
            //If all goes well logging the contact's id
            //console.log(response);
            //console.log(response.statusCode);
            console.log('Successfully added contact as an audience member.');
            res.sendFile(__dirname + "/success.html");
            //console.log(n1,n2,n3);
           // console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
}catch (err) {
    console.log("error is "+err.status);
    console.log("====== ERROR ======");
    console.log(JSON.parse(err.response.error.text).detail); 
    res.sendFile(__dirname + "/failure.html");
  }

};

    /* const  data={
        members:[
            {
                email_address: n3,
                status:"subscribed",
                merged_fields:
                {
                    FNAME:n1,
                    LNAME:n2
                }
            }
        ]
    };
    const  jsondata= JSON.stringify(data);
    const url="https://us14.api.mailchimp.com/3.0/lists/71cab5a5dc";
    const options={
        method:"POST",
        auth:"pritika:faba5703b0e8ed23cf7d94cd576afe10-us14"
    };
    const request=https.request(url,options,function(response)
    {
         response.on('data',function(data)
         {
             console.log(JSON.parse(data));
         });
    });
    request.write(jsondata);
    request.end;
 */


    //console.log(n1,n2,n3);
    //response.send("thanks"+ res);
   // run().catch(e => res.sendFile(__dirname + "/failure.html"));
   run();
}); 
app.post("/failure", function(req, res) {
    res.redirect("/");
  });
app.listen(process.env.PORT || 3000,function(){// heroku will run this program on their not in 3000 port so to do so process.env.port
    console.log(" ported  is in  3000")
    });
    //faba5703b0e8ed23cf7d94cd576afe10-us14
    //71cab5a5dc