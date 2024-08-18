const User = require('../models/User');
const bcrypt = require('bcryptjs'); 

function broadcast(wss, data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

exports.createAdmin = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const { role: requesterRole } = req.user || {};
    if (requesterRole !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmins can create admins.' });
    }
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'admin',
      phoneNumber,
      profileImage: req.file ? `${req.file.filename}` : null,
      subscription_status: true, 
    });

    await newAdmin.save();

    const sanitizedAdmin = { ...newAdmin.toObject(), password: undefined };
    console.log(`Created admin: ${JSON.stringify(sanitizedAdmin)}`);

    broadcast(req.app.locals.wss, { message: 'Admin created', admin: sanitizedAdmin });

    res.status(201).json({ message: 'Admin created successfully', admin: sanitizedAdmin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOneAndDelete({ _id: userId });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Broadcast to all WebSocket clients
    broadcast(req.app.locals.wss, { message: 'User deleted', userId });

    res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createEnduser = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  try {
    const { firstName, lastName, email, password, phoneNumber, createdByAdmin } = req.body;
    const { role: requesterRole } = req.user || {};
    if (!['superadmin', 'admin'].includes(requesterRole)) {
      return res.status(403).json({ error: 'Only admins and superadmins can create EndUsers.' });
    }

    const createdByAdminArray = Array.isArray(createdByAdmin) ? createdByAdmin : [createdByAdmin];

    const newEnduser = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'enduser',
      phoneNumber,
      profileImage: req.file ? `${req.file.filename}` : null,
      createdByAdmin: createdByAdminArray,
      subscription_status: true, 
    });

    await newEnduser.save();

    const sanitizedEnduser = { ...newEnduser.toObject(), password: undefined };
    console.log(`Created enduser: ${JSON.stringify(sanitizedEnduser)}`);

    broadcast(req.app.locals.wss, { message: 'Enduser created', enduser: sanitizedEnduser });

    res.status(201).json({ message: 'Enduser created successfully', enduser: sanitizedEnduser });
  } catch (error) {
    console.error('Error creating enduser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    console.log(`Fetching user by email: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Fetched user: ${JSON.stringify(user)}`);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, subscription_status } = req.body;
  const profileImage = req.file ? req.file.filename : undefined;

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log(`Admin not found with ID: ${id}`);
      return res.status(404).json({ message: 'Admin not found' });
    }

    console.log('Updating admin with ID:', id);
    console.log('Request body:', req.body); 
    
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    
    if (typeof subscription_status === 'boolean') {
      user.subscription_status = subscription_status;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    console.log(`Admin with ID ${id} updated successfully`);
    console.log('Updated admin:', user);

    broadcast(req.app.locals.wss, { message: 'Admin updated', admin: user });

    res.status(200).json({ message: 'Admin updated successfully', user });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Error updating admin', error });
  }
};

exports.updateEndUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, role, createdByAdmin } = req.body;
  const profileImage = req.file ? req.file.filename : undefined;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'End user not found' });
    }

    if (user.role !== 'enduser') {
      return res.status(403).json({ message: 'User is not an end user' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.role = role || user.role;

    if (profileImage) {
      user.profileImage = profileImage;
    }

    // Update the createdByAdmin field if provided
    if (Array.isArray(createdByAdmin)) {
      // Ensure createdByAdmin contains only unique values and valid ObjectIDs (strings)
      user.createdByAdmin = [...new Set(createdByAdmin)];
    }

    await user.save();

    broadcast(req.app.locals.wss, { message: 'Enduser updated', enduser: user });

    res.status(200).json({ message: 'End user updated successfully', user });
  } catch (error) {
    console.error('Error updating end user:', error);
    res.status(500).json({ message: 'Error updating end user', error });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });

    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllEndUsers = async (req, res) => {
  try {
    const endUsers = await User.find({ role: 'enduser' });

    res.status(200).json(endUsers);
  } catch (error) {
    console.error('Error fetching EndUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, resetToken } = req.body;

  try {
    // Update user document with resetToken
    const updatedUser = await User.findOneAndUpdate({ email }, { resetToken }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send reset token to client or through email (implementation not shown here)
    res.json({ message: 'Reset token saved successfully' });
  } catch (error) {
    console.error('Error saving reset token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  console.log('Received request to update password');
  console.log('Email:', email);
  console.log('New Password:', newPassword);

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    console.log('Updating password in database');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (updatedUser) {
      console.log('Password updated successfully:', updatedUser);

      // Broadcast to all WebSocket clients
      broadcast(req.app.locals.wss, { message: 'Password updated', email });

      res.status(200).json({ success: true });
    } else {
      console.log('No matching user found or password not updated');
      res.status(404).json({ success: false, message: 'No matching user found or password not updated' });
    }
  } catch (error) {
    console.log('Error updating password in userservice:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};