exports.updateUser = (user, req, res) => {
  user.email = req.body.email
  if (req.body.newPassword) {
    user.password = req.body.newPassword
  }

  user.save((err) => {
    if (err) {
      req.flash('error', 'Failed to update settings.')
      return res.redirect('/settings')
    } else {
      return res.render('settings', {
        title: 'Your Settings',
        user: user,
      })
    }
  })
}