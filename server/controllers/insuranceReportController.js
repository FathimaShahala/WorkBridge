
const Insurance = require("../models/Insurance");
const InsuranceClaim = require("../models/InsuranceClaim");

// ==========================================
// Get Insurance Reports
// ==========================================

const getInsuranceReports = async (req, res) => {
  try {
    const policies = await Insurance.find().lean();
    const claims = await InsuranceClaim.find().lean();

    // ==========================================
    // Policy Statistics
    // ==========================================

    const totalPolicies = policies.length;

    const activePolicies = policies.filter(
      (policy) => policy.status === "active"
    ).length;

    const pendingPolicies = policies.filter(
      (policy) => policy.status === "pending"
    ).length;

    const expiredPolicies = policies.filter(
      (policy) => policy.status === "expired"
    ).length;

    const cancelledPolicies = policies.filter(
      (policy) => policy.status === "cancelled"
    ).length;

    // ==========================================
    // Financial Statistics
    // ==========================================

    const totalCoverage = policies.reduce(
      (total, policy) =>
        total +
        Number(policy.coverageAmount || 0),
      0
    );

    const totalPremium = policies.reduce(
      (total, policy) =>
        total +
        Number(policy.premiumAmount || 0),
      0
    );

    // ==========================================
    // Claim Statistics
    // ==========================================

    const totalClaims = claims.length;

    const pendingClaims = claims.filter(
      (claim) => claim.status === "pending"
    ).length;

    const underReviewClaims = claims.filter(
      (claim) =>
        claim.status === "under_review"
    ).length;

    const approvedClaims = claims.filter(
      (claim) => claim.status === "approved"
    ).length;

    const rejectedClaims = claims.filter(
      (claim) => claim.status === "rejected"
    ).length;

    const settledClaims = claims.filter(
      (claim) => claim.status === "settled"
    ).length;

    // ==========================================
    // Claim Financial Statistics
    // ==========================================

    const totalClaimedAmount =
      claims.reduce(
        (total, claim) =>
          total +
          Number(claim.claimAmount || 0),
        0
      );

    const totalApprovedAmount =
      claims.reduce(
        (total, claim) =>
          total +
          Number(claim.approvedAmount || 0),
        0
      );

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      policyStats: {
        total: totalPolicies,
        active: activePolicies,
        pending: pendingPolicies,
        expired: expiredPolicies,
        cancelled: cancelledPolicies,
      },

      claimStats: {
        total: totalClaims,
        pending: pendingClaims,
        underReview: underReviewClaims,
        approved: approvedClaims,
        rejected: rejectedClaims,
        settled: settledClaims,
      },

      financialStats: {
        totalCoverage,
        totalPremium,
        totalClaimedAmount,
        totalApprovedAmount,
      },
    });
  } catch (error) {
    console.error(
      "Insurance Reports Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate insurance reports.",
    });
  }
};

module.exports = {
  getInsuranceReports,
};
