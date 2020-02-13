module.exports={
  ensureAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg','Not Authorized');
    res.redirect('/users/login');
  },
  isAdmin: function(res,req,next){
    if(admin==1){
      return next();
    }
    req.flash('error_msg','Not Authorized');
    res.redirect('/admin/login');
  }
}
