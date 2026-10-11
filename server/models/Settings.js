const mongoose = require("mongoose");
 const settingsSchema = new mongoose.Schema(
     {
         platformName: { type: String, default: "WorkBridge", trim: true, }, 
         contactEmail: { type: String, default: "", trim: true, lowercase: true, }, 
         contactPhone: { type: String, default: "", trim: true, }, 
         supportAddress: { type: String, default: "", trim: true, }, 
         allowRegistration: { type: Boolean, default: true, }, 
         requireVerification: { type: Boolean, default: true, }, 
         emailNotifications: { type: Boolean, default: true, }, 
         complaintNotifications: { type: Boolean, default: true, }, 
         maintenanceMode: { type: Boolean, default: false, }, 
     }, 
     { timestamps: true, } 
 ); 
 module.exports = mongoose.model( "Settings", settingsSchema );