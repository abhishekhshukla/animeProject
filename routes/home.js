const { response } = require("express");
const express=require("express")
const router=express.Router();
const Comment=require("../models/comments")
const request=require("request");
const mongoose=require("mongoose")

router.get("/", async (req,res)=>{                 // This is for landing Page will Display Some randome Anime based on Popularity 
   await request(`https://api.aniapi.com/v1/anime/`, (error,response,body)=>{
      if(error) console.log("erroe")
      let x=  JSON.parse(body);
      let y=x.data.documents;
     res.render("home",{cmp:y});                // rendring ejs file for frontend

})

})

router.get("/search",(req,res)=>{                    // This is for Search Page will render you on search Page
      
	res.render("search")

});

router.post("/search",(req,res)=>{                                           // Posting based on search information
            
  if(req.body.id)                        // This will be run when id would be given
  {
      
      res.redirect(`/home/getAnime/${req.body.id}`)
  }

  else if(req.body.title)                 // This would run when id would not given but title is present
    {
      request(`https://api.aniapi.com/v1/anime?title=${req.body.title}`,(error,response,body)=>{         // Making API request to get information

                    if(error)
                       res.status(404).render('search');

                    else
                     {   
                         let jsonFormat=JSON.parse(body);
                          if(jsonFormat.status_code==404)                  // If anime not found Wrong Id then status code 404 and will go back to home page
                              res.status(404).render("search")
                          res.status(200).render("home",{cmp:jsonFormat.data.documents});
                     }



       })
    }

    else if(req.body.genre)                    // Search by Gnere information
    {
      request(`https://api.aniapi.com/v1/anime?genres=${req.body.genre}`,(error,response,body)=>{     // APi request

                    if(error)
                       res.status(404).render('search');
                    else
                     {   
                           
                         let jsonFormat= JSON.parse(body);
                         
                         if(jsonFormat.status_code==404)
                             res.status(404).render("search")
                          else
                          res.status(200).render("home",{cmp:jsonFormat.data.documents});
                     }



       })
    }

    else res.render("search")
       
})




router.get("/getAnime/:id",(req,res)=>{                  // Direst print Anime info
  
   request(`https://api.aniapi.com/v1/anime/${req.params.id}`,(error,response,body)=>{

      if(error)
         res.status(404).render('search');
      else
       {   let jsonFormat=  JSON.parse(body); 
              if(jsonFormat.status_code==404)
              res.status(404).render("search")
              else
              Comment.find({},(err,data)=>{           // Geting all comments for Particular Anime type 

                 res.status(200).render("anime",{cmp:jsonFormat.data,comments:data});
              })
       }

})
   
})



router.get("/home/search",(req,res)=>{                               // Get Request for Search
   res.redirect("/home/search")
})


router.get("/comment/:id",(req,res)=>{                             // To add new comment
      if(req.isAuthenticated())                          // First Checking user authentication 
       res.render("comments/new",{emp:req.params.id})           // after successfull authentication we will add new comment
       else { 
          req.flash("You need to Loogin")                      // else ask him/her to login
          res.redirect(`/home/getAnime/${req.params.animeId}`)
       }
})

router.post("/comments",(req,res)=>{                  // Post request for comment, to add them in database
          
   Comment.create({text:req.body.text,rating:req.body.rating,animeId:req.body.animeId,username:req.body.username},(err,small)=>{
      if(err)
        req.render("home")
        else res.status(201).redirect(`/home/getAnime/${req.body.animeId}`)

   })

})

router.get("/delete/:id",async (req,res)=>{                    // This is to delete  comment from database based on animeId and username

    await Comment.deleteOne({animeId:req.params.id,username:req.user.username},(err)=>{
         if(err)
         {
            req.flash("Something Went wrong")

         }
         res.redirect(`/home/getAnime/${req.params.id}`)
      })
})

module.exports=router;