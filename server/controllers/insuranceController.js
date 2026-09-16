const Insurance = require("../models/Insurance");
const User = require("../models/User");

// Create Insurance Policy
const createInsurance = async (req, res) => {
  try {
    const {
      worker,
      policyNumber,
      insuranceProvider,
      policyType,
      coverageAmount,
      premiumAmount,
      startDate,
      endDate,
      status,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !worker ||
      !policyNumber ||
      !insuranceProvider ||
      !policyType ||
      coverageAmount === undefined ||
      premiumAmount === undefined ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check worker exists
    const workerUser = await User.findOne({
      _id: worker,
      role: "worker",
    });

    if (!workerUser) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    // Check duplicate policy number
    const existingPolicy = await Insurance.findOne({
      policyNumber: policyNumber.trim(),
    });

    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: "Policy number already exists.",
      });
    }

    // Create policy
    const insurance = await Insurance.create({
      worker,
      policyNumber: policyNumber.trim(),
      insuranceProvider: insuranceProvider.trim(),
      policyType: policyType.trim(),
      coverageAmount,
      premiumAmount,
      startDate,
      endDate,
      status: status || "pending",
      notes: notes ? notes.trim() : "",
    });

    // Return populated policy
    const populatedInsurance = await Insurance.findById(insurance._id).populate(
      "worker",
      "fullName email phone profileImage",
    );

    return res.status(201).json({
      success: true,
      message: "Insurance policy created successfully.",
      insurance: populatedInsurance,
    });
  } catch (error) {
    console.error("Create Insurance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Insurance Policies
const getAllInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.find()
      .populate("worker", "fullName email phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: insurance.length,
      insurance,
    });
  } catch (error) {
    console.error("Get All Insurance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Worker's Insurance Policies
const getMyInsurance = async (req, res) => {
  try {
    const workerId = req.user._id || req.user.id;

    const insurance = await Insurance.find({
      worker: workerId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: insurance.length,
      insurance,
    });
  } catch (error) {
    console.error("Get My Insurance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Worker's Single Insurance Policy
const getMyInsuranceById = async (req, res) => {
  try {
    const workerId = req.user._id || req.user.id;
    const insurance = await Insurance.findOne({
      _id: req.params.id,
      worker: workerId,
    });
    if (!insurance) {
      return res
        .status(404)
        .json({ success: false, message: "Insurance policy not found." });
    }
    return res.status(200).json({ success: true, insurance });
  } catch (error) {
    console.error("Get My Insurance By ID Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Single Insurance Policy
const getInsuranceById = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id).populate(
      "worker",
      "fullName email phone profileImage",
    );

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found.",
      });
    }

    return res.status(200).json({
      success: true,
      insurance,
    });
  } catch (error) {
    console.error("Get Insurance By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Insurance Policy
const updateInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found.",
      });
    }

    const {
      policyNumber,
      insuranceProvider,
      policyType,
      coverageAmount,
      premiumAmount,
      startDate,
      endDate,
      status,
      notes,
    } = req.body;

    if (policyNumber !== undefined) {
      insurance.policyNumber = policyNumber.trim();
    }

    if (insuranceProvider !== undefined) {
      insurance.insuranceProvider = insuranceProvider.trim();
    }

    if (policyType !== undefined) {
      insurance.policyType = policyType.trim();
    }

    if (coverageAmount !== undefined) {
      insurance.coverageAmount = coverageAmount;
    }

    if (premiumAmount !== undefined) {
      insurance.premiumAmount = premiumAmount;
    }

    if (startDate !== undefined) {
      insurance.startDate = startDate;
    }

    if (endDate !== undefined) {
      insurance.endDate = endDate;
    }

    if (status !== undefined) {
      insurance.status = status;
    }

    if (notes !== undefined) {
      insurance.notes = notes.trim();
    }

    await insurance.save();

    const updatedInsurance = await Insurance.findById(insurance._id).populate(
      "worker",
      "fullName email phone profileImage",
    );

    return res.status(200).json({
      success: true,
      message: "Insurance policy updated successfully.",
      insurance: updatedInsurance,
    });
  } catch (error) {
    console.error("Update Insurance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Insurance Policy
const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found.",
      });
    }

    await insurance.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Insurance policy deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Insurance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================== // Get All Insured Workers // ==========================================
const getInsuredWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select(
      "fullName email phone profileImage isVerified status",
    );
    const workersWithInsurance = await Promise.all(
      workers.map(async (worker) => {
        const policies = await Insurance.find({ worker: worker._id }).sort({
          createdAt: -1,
        });
        return {
          ...worker.toObject(),
          policies,
          policyCount: policies.length,
          activePolicies: policies.filter(
            (policy) => policy.status === "active",
          ).length,
        };
      }),
    );
    return res
      .status(200)
      .json({
        success: true,
        count: workersWithInsurance.length,
        workers: workersWithInsurance,
      });
  } catch (error) {
    console.error("Get Insured Workers Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}; // ==========================================
 // Get Single Worker
 // ========================================== 
const getInsuredWorkerById = async (req, res) => { 
  try {
     const worker = await User.findOne({
       _id: req.params.id,
        role: "worker",
       }).select(
         "fullName email phone profileImage isVerified status"
         );
          if (!worker) { 
            return res.status(404).json({
               success: false, message: "Worker not found.", 
              });
             }
              const policies = await Insurance.find({
                 worker: worker._id,
                 }).sort({ createdAt: -1 }); 
                 return res.status(200).json({ 
                  success: true,
                   worker,
                    policies,
                   });
                   } catch (error) {
                     console.error("Get Insured Worker Error:", error);
                      return res.status(500).json({ 
                        success: false,
                         message: "Server Error", 
                        });
                       }
                       };

module.exports = {
  createInsurance,
  getAllInsurance,
  getMyInsurance,
  getMyInsuranceById,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  getInsuredWorkers,
  getInsuredWorkerById,
};
