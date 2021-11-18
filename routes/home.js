const { response } = require("express");
const express=require("express")
const router=express.Router();
const Comment=require("../models/comments")
const request=require("request");
const mongoose=require("mongoose")
router.get("/", async (req,res)=>{
   await request(`https://api.aniapi.com/v1/anime/`, (error,response,body)=>{
      if(error) console.log("erroe")
     // console.log(response);
     //  console.log(JSON.parse(body));
      let x=  JSON.parse(body);
      let y=x.data.documents;
      console.log("here");
     res.render("home",{cmp:y});

})

})

router.get("/search",(req,res)=>{
      
	res.render("search")

});

router.post("/search",(req,res)=>{
            
  if(req.body.id)
  {
      //  request(`https://api.aniapi.com/v1/anime/${req.body.id}`,(error,response,body)=>{

      //               if(error)
      //                  res.render('search');
      //               else
      //                {   let x=  JSON.parse(body); 
      //                 console.log(x.data);
      //                     res.render("anime",{cmp:x.data});
      //                }

      //  })
      res.redirect(`/home/getAnime/${req.body.id}`)
  }

  else if(req.body.title)
    {
      request(`https://api.aniapi.com/v1/anime?title=${req.body.title}`,(error,response,body)=>{

                    if(error)
                       res.status(404).render('search');

                    else
                     {   
                         let x=JSON.parse(body);
                         console.log(x.status_code);
                          if(x.status_code==404)
                              res.status(404).render("search")
                          res.status(200).render("home",{cmp:x.data.documents});
                     }



       })
    }

    else if(req.body.genre)
    {
      request(`https://api.aniapi.com/v1/anime?genres=${req.body.genre}`,(error,response,body)=>{

                    if(error)
                       res.status(404).render('search');
                    else
                     {   
                           
                         let x= JSON.parse(body);
                         console.log(x);
                         if(x.status_code==404)
                             res.status(404).render("search")
                          else
                          res.status(200).render("home",{cmp:x.data.documents});
                     }



       })
    }

    else res.render("search")
       
})




router.get("/getAnime/:id",(req,res)=>{
  
   request(`https://api.aniapi.com/v1/anime/${req.params.id}`,(error,response,body)=>{

      if(error)
         res.status(404).render('search');
      else
       {   let x=  JSON.parse(body); 
      //  console.log(x.data);
              Comment.find({},(err,data)=>{

                 res.status(200).render("anime",{cmp:x.data,comments:data});
              })
       }

})
   
})



router.get("/home/search",(req,res)=>{
   res.redirect("/home/search")
})


router.get("/comment/:id",(req,res)=>{
      if(req.isAuthenticated())
       res.render("comments/new",{emp:req.params.id})
       else {
          req.flash("You need to Loogin")
          res.redirect(`/home/getAnime/${req.params.animeId}`)
       }
})

router.post("/comments",(req,res)=>{
          
   Comment.create({text:req.body.text,rating:req.body.rating,animeId:req.body.animeId,username:req.body.username},(err,small)=>{
      if(err)
        req.render("home")
        else res.status(201).redirect(`/home/getAnime/${req.body.animeId}`)

   })

})

router.get("/delete/:id",async (req,res)=>{

    await Comment.deleteOne({animeId:req.params.id,username:req.user.username},(err)=>{
         if(err)
         {
            req.flash("Something Went wrong")

         }
         res.redirect(`/home/getAnime/${req.params.id}`)
      })
})

module.exports=router;