var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display user page
router.get('/', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.render('public',{msg:""}); 
    }  
    else
    {
        res.redirect('/profile');
    }
});
router.post('/login', function(req, res, next) {      
    //login
    let phone = req.body.phone.trim();
    let password = req.body.password.trim(); 

    let q4="SELECT count(*) as count2 FROM user where `phone`='"+phone+"' and `password`='"+password+"'";
    dbConn.query(q4,function(err,result4){
    //queries string
    if(result4[0].count2>0)
    {
        req.session.ph=phone;
        res.redirect('/profile');
        
    }
    else
    {
        console.log(result4);
        res.render('public',{msg:"invalid login details"});   
    }
    });
});
router.post('/signup', function(req, res, next) {      
    //signup
    let name = req.body.name.trim();
    let phone = req.body.phone.trim();
    let password = req.body.password.trim(); 

    var form_data = {
        name: name,
        phone: phone,
        password: password,
    }
    var form_data1 = {
        phone: phone,
        amount: "50",
        details:"new account create",
        type:"CR",
        wallet:"50",
    }

    let q4="SELECT count(*) as count2 FROM user where `phone`='"+phone+"'";
    dbConn.query(q4,function(err,result4){
    //queries string
    if(result4[0].count2>0)
    {
        
        res.render('public',{msg:"phone already exist"});
    }
    else
    {
        let q1="insert into `user` set ?";
        //execution
        dbConn.query(q1, form_data, function(err, result) {
            if (err) {
                //req.flash('error', err)
                res.render('public',{msg:"error"})
            }
            else{
                let q2="insert into `transaction` set ?";
                //execution
                dbConn.query(q2, form_data1, function(err, result) {
                    if (err) {
                        //req.flash('error', err)
                        res.render('public',{msg:"error"})
                    }
                    else{
                        //req.flash('success', 'Registration sucessfully done');
                        res.render('public',{msg:"Registration sucessfully done"});  
                    }
                });   
            }
        }); 
    }
    });
});
router.get('/profile', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/profile',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/profile',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        res.render('public/profile',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:result2,
                            });
                    }
                    });
        }
        });
    }
});
router.get('/add_money', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/add_money',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/add_money',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        res.render('public/add_money',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_money', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/add_money',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/add_money',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        let phone = req.body.phone.trim();
                        let amount = req.body.amount.trim();
                        let card = req.body.card.trim(); 
                        let wallet=parseInt(result2[0].wallet)+parseInt(amount);
                        var form_data1 = {
                            phone: phone,
                            amount: amount,
                            details:"money added by "+card,
                            type:"CR",
                            wallet:wallet,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/add_money',{msg:"error"})
                            }
                            else{
                                //req.flash('success', 'Registration sucessfully done');
                                res.render('public/add_money',{msg:"Money Added sucessfully done",name: result[0].name,
                                phone: result[0].phone,
                                wallet: result2[0].wallet,
                                data:'',});  
                            }
                        });   

                    }
                    });
        }
        });
    }
});
router.get('/send_money', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/send_money',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/send_money',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        req.session.wallet=result2[0].wallet;
                        res.render('public/send_money',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_send_money', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/send_money',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            let phone1=req.session.ph;
            let phone2 = req.body.phone.trim();
            let amount = req.body.amount.trim();
            let details = req.body.details.trim(); 
let q4="SELECT count(*) as count2 FROM user where `phone`='"+phone2+"'";
    dbConn.query(q4,function(err,result11){
    //queries string
    if(result11[0].count2==0)
    {
        
        res.render('public/send_money',{msg:"invalid receipent",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: req.session.wallet,
                                                data:'',}); 
    }
   else
   {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/send_money',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        if(parseInt(result2[0].wallet)<parseInt(amount))
                        {
                            res.render('public/send_money',{msg:"insufficient balance",name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',});    
                        }
                        else
                        {
                        let wallet1=parseInt(result2[0].wallet)-parseInt(amount);
                        var form_data1 = {
                            phone: phone1,
                            amount: amount,
                            details:"money debited amount "+amount+" to "+phone2,
                            type:"DR",
                            wallet:wallet1,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/send_money',{msg:"error"})
                            }
                            else{

                                let q2="SELECT * FROM transaction where `phone`="+phone2+" order by `id` desc";
                                dbConn.query(q2,function(err,result4){
                                    if(err) {
                                        req.flash('error', err);
                                        // render to views/users/index.ejs
                                        
                                        res.render('public/send_money',{
                                            name: '',
                                            phone: '',
                                            wallet: '',
                                            data:'',
                                        });   
                                    } else {
                                        let phone1=req.session.ph;
                                        let phone2 = req.body.phone.trim();
                                        let amount = req.body.amount.trim();
                                        let details = req.body.details.trim(); 
                                        let wallet1=parseInt(result4[0].wallet)+parseInt(amount);
                                        var form_data1 = {
                                            phone: phone2,
                                            amount: amount,
                                            details:"money created amount "+amount+" from "+phone1,
                                            type:"CR",
                                            wallet:wallet1,
                                        }
                                        let q2="insert into `transaction` set ?";
                                        //execution
                                        dbConn.query(q2, form_data1, function(err, result5) {
                                            if (err) {
                                                //req.flash('error', err)
                                                res.render('public/send_money',{msg:"error"})
                                            }
                                            else{
                                                //req.flash('success', 'Registration sucessfully done');
                                                res.render('public/send_money',{msg:"Money Sended sucessfully done",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: result2[0].wallet,
                                                data:'',});  
                                            }
                                        });   
                
                                    }
                                    });
                            }
                        }); 
                    }  

                    }
                    });
        }
        });
    }
 });
}
});
router.get('/mobile', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/mobile',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/mobile',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        req.session.wallet=result2[0].wallet;
                        res.render('public/mobile',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_mobile', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/mobile',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            let phone1=req.session.ph;
            let phone2 = req.body.phone.trim();
            let amount = req.body.amount.trim();
            let details = req.body.details.trim(); 

            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/mobile',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        if(parseInt(result2[0].wallet)<parseInt(amount))
                        {
                            res.render('public/mobile',{msg:"insufficient balance",name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',});    
                        }
                        else
                        {
                        let wallet1=parseInt(result2[0].wallet)-parseInt(amount);
                        var form_data1 = {
                            phone: phone1,
                            amount: amount,
                            details:"money debited amount "+amount+" to "+phone2,
                            type:"DR",
                            wallet:wallet1,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/mobile',{msg:"error"})
                            }
                            else{

                               
                                                //req.flash('success', 'Registration sucessfully done');
                                                res.render('public/mobile',{msg:"Mobile Recharge sucessfully done",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: result2[0].wallet,
                                                data:'',});  
                            }
                                    });
                                }
                            }
                    

                    
                    });
    }
 });
}
});
router.get('/dth', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/dth',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/dth',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        req.session.wallet=result2[0].wallet;
                        res.render('public/dth',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_dth', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/dth',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            let phone1=req.session.ph;
            let phone2 = req.body.phone.trim();
            let amount = req.body.amount.trim();
            let details = req.body.details.trim(); 

            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/dth',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        if(parseInt(result2[0].wallet)<parseInt(amount))
                        {
                            res.render('public/dth',{msg:"insufficient balance",name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',});    
                        }
                        else
                        {
                        let wallet1=parseInt(result2[0].wallet)-parseInt(amount);
                        var form_data1 = {
                            phone: phone1,
                            amount: amount,
                            details:"money debited amount "+amount+" to "+phone2,
                            type:"DR",
                            wallet:wallet1,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/dth',{msg:"error"})
                            }
                            else{

                               
                                                //req.flash('success', 'Registration sucessfully done');
                                                res.render('public/dth',{msg:"dth Recharge sucessfully done",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: result2[0].wallet,
                                                data:'',});  
                            }
                                    });
                                }
                            }
                    

                    
                    });
    }
 });
}
});
router.get('/electric', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/electric',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/electric',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        req.session.wallet=result2[0].wallet;
                        res.render('public/electric',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_electric', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/electric',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            let phone1=req.session.ph;
            let phone2 = req.body.phone.trim();
            let amount = req.body.amount.trim();
            let details = req.body.details.trim(); 

            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/electric',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        if(parseInt(result2[0].wallet)<parseInt(amount))
                        {
                            res.render('public/electric',{msg:"insufficient balance",name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',});    
                        }
                        else
                        {
                        let wallet1=parseInt(result2[0].wallet)-parseInt(amount);
                        var form_data1 = {
                            phone: phone1,
                            amount: amount,
                            details:"money debited amount "+amount+" to "+phone2,
                            type:"DR",
                            wallet:wallet1,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/electric',{msg:"error"})
                            }
                            else{

                               
                                                //req.flash('success', 'Registration sucessfully done');
                                                res.render('public/electric',{msg:"electric Recharge sucessfully done",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: result2[0].wallet,
                                                data:'',});  
                            }
                                    });
                                }
                            }
                    

                    
                    });
    }
 });
}
});
router.get('/movie', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {
    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/movie',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/movie',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        // render to views/users/index.ejs
                        req.session.wallet=result2[0].wallet;
                        res.render('public/movie',{
                            name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',
                            msg:'',
                            });
                    }
                    });
        }
        });
    }
});
router.post('/store_movie', function(req, res, next) {      
    if(!req.session.ph)
    {
        res.redirect('/');
    } 
    else
    {


    let q1="SELECT * FROM user where `phone`="+req.session.ph;
    dbConn.query(q1,function(err,result){
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            
            res.render('public/movie',{
                name: '',
                phone: '',
                wallet: '',
                data:'',
            });   
        } else {
            let phone1=req.session.ph;
            let phone2 = req.body.phone.trim();
            let amount = req.body.amount.trim();
            let details1 = req.body.details1.trim();
            let details2 = req.body.details2.trim(); 

            // render to views/users/index.ejs
            let q2="SELECT * FROM transaction where `phone`="+req.session.ph+" order by `id` desc";
                dbConn.query(q2,function(err,result2){
                    if(err) {
                        req.flash('error', err);
                        // render to views/users/index.ejs
                        
                        res.render('public/movie',{
                            name: '',
                            phone: '',
                            wallet: '',
                            data:'',
                        });   
                    } else {
                        if(parseInt(result2[0].wallet)<parseInt(amount))
                        {
                            res.render('public/movie',{msg:"insufficient balance",name: result[0].name,
                            phone: result[0].phone,
                            wallet: result2[0].wallet,
                            data:'',});    
                        }
                        else
                        {
                        let wallet1=parseInt(result2[0].wallet)-parseInt(amount);
                        var form_data1 = {
                            phone: phone1,
                            amount: amount,
                            details:"movie name "+details1+" theater "+details2+" no of ticket "+phone2,
                            type:"DR",
                            wallet:wallet1,
                        }
                        let q2="insert into `transaction` set ?";
                        //execution
                        dbConn.query(q2, form_data1, function(err, result3) {
                            if (err) {
                                //req.flash('error', err)
                                res.render('public/movie',{msg:"error"})
                            }
                            else{

                               
                                                //req.flash('success', 'Registration sucessfully done');
                                                res.render('public/movie',{msg:"movie Recharge sucessfully done",name: result[0].name,
                                                phone: result[0].phone,
                                                wallet: result2[0].wallet,
                                                data:'',});  
                            }
                                    });
                                }
                            }
                    

                    
                    });
    }
 });
}
});
router.get('/logout', function(req, res, next) {    
    // render to add.ejs
    if(!req.session.ph)
    {
        res.redirect('/');
    }  
    else
    {
        req.session.destroy();
        res.redirect('/');
    }
});
module.exports = router;